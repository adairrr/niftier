// SPDX-License-Identifier: UNLICENSED

pragma experimental ABIEncoderV2;
pragma solidity >=0.7.0 <0.8.0;


import "@openzeppelin/contracts-upgradeable/introspection/ERC165CheckerUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/GSN/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "../access/AccessRestriction.sol";
import "../access/AccessRestrictable.sol";
import "./TypedERC1155Composable.sol";

contract ComposableOrchestrator is Initializable, ContextUpgradeable, AccessRestrictable {

    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address;

    event ComposableCreated(uint256 indexed _tokenId);

    TypedERC1155Composable public composableToken;

    /*
     * TODO TODO TODO!!!!
     */
    bytes4 private constant _INTERFACE_ID_ERC1155COMPOSABLE = 0x1234abcd;

    /**
     * @notice initializer
     * @param _accessRestriction address for deployed access restriction used for access control.
     * @param _composableToken address of the parent token contract with which this factory interacts.
     */
    function initialize(
        AccessRestriction _accessRestriction,
        address _composableToken
    ) public virtual initializer {
        __ComposableOrchestrator_init(_accessRestriction, _composableToken);
    }

    function __ComposableOrchestrator_init(
        AccessRestriction _accessRestriction,
        address _composableToken
    ) internal initializer {
        __Context_init_unchained();
        __AccessRestrictable_init_unchained(_accessRestriction);
        __ComposableOrchestrator_init_unchained(_composableToken);
    }

    function __ComposableOrchestrator_init_unchained(
        address _composableToken
    ) internal initializer {
        require(
            ERC165CheckerUpgradeable.supportsInterface(_composableToken, _INTERFACE_ID_ERC1155COMPOSABLE),
            "Composable contract must support the ERC1155ComposableInterface."
        );
        composableToken = TypedERC1155Composable(_composableToken);
    }

    /**
     * @notice Called by the minting of a parent with children. This is when each is new and a quantity of 1 is desired.
     * Ex: Artpiece minting, mint layers TO artpiece.
     * @dev TokenTypes must exist.
     */
    function mintChildrenToParent(
        bytes32 _parentTokenTypeName,
        string memory _parentTokenUri,
        bytes32 _childTokenTypeName,
        string[] memory _childTokenUris,
        uint256[] memory _childTokenAmounts,
        address _creator
    ) external returns (uint256[] memory childTokenIds) {
        // create the parent Token
        uint256 parentTokenId = composableToken.mint(
            _creator, 
            _parentTokenTypeName, 
            _parentTokenUri, 
            1, 
            _creator, 
            '' // no data
        );

        // mint the child tokens to the parent token
        childTokenIds = composableToken.mintBatch(
            address(composableToken), 
            _childTokenTypeName, 
            _childTokenUris, 
            _childTokenAmounts, 
            _creator, 
            abi.encodePacked(parentTokenId)
        );
    }
    
    // function associateChildrenToParent(
    //     uint256 _parentTokenId,
    //     uint256[] _childTokenIds,
    //     address _caller
    // )
}
