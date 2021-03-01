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
     * @dev New children -> new parent
     */
    function mintChildrenAndParent(
        bytes32 _parentTokenTypeName,
        string memory _parentTokenUri,
        bytes32 _childTokenTypeName,
        string[] memory _childTokenUris,
        uint256[] memory _childTokenAmounts,
        address _creator
    ) external returns (uint256, uint256[] memory) {
        // TODO there is probably a better way to do this
        // create the parent Token
        uint256 parentTokenId = composableToken.mint(
            _creator, 
            _parentTokenTypeName, 
            _parentTokenUri, 
            1, 
            _creator, 
            '' // no data
        );

        return (parentTokenId, this.mintChildrenToParent(
            parentTokenId,
            _childTokenTypeName, 
            _childTokenUris, 
            _childTokenAmounts, 
            _creator
        ));
    }

    /**
     * Mint children tokens and associate them with the provided parent token.
     * Note that all children must be owned by creator and have no other associations.
     * @dev New children -> existing parent
     */
    function mintChildrenToParent(
        uint256 _parentTokenId,
        bytes32 _childTokenTypeName,
        string[] memory _childTokenUris,
        uint256[] memory _childTokenAmounts,
        address _creator
    ) external returns (uint256[] memory) {
        // mint the child tokens to the parent token
        return composableToken.mintBatch(
            address(composableToken), 
            _childTokenTypeName, 
            _childTokenUris, 
            _childTokenAmounts, 
            _creator, 
            abi.encodePacked(_parentTokenId)
        );
    }

    /**
     * Mint a parent token and associate all provided children to it.
     * Note that all children must be owned by creator and have no other associations.
     * @dev Existing children -> new parent
     */
    function mintParentAndAssociateChildren(
        bytes32 _parentTokenTypeName,
        string memory _parentTokenUri,
        uint256[] memory _childTokenIds,
        uint256[] memory _childTokenAmounts,
        address _creator
    ) external returns (uint256 parentTokenId) {
        parentTokenId = composableToken.mint(
            _creator, 
            _parentTokenTypeName, 
            _parentTokenUri, 
            1, 
            _creator, 
            '' // no data
        );

        this.associateChildrenToParent(
            parentTokenId, 
            _childTokenIds, 
            _childTokenAmounts, 
            _creator
        );
    }

        
    /** 
     * @notice takes existing parent id, and existing child ids, and transfer children to parent.
     * Note that all children must be owned by creator and have no other associations.
     * @dev Existing children -> Existing parent
     */
    function associateChildrenToParent(
        uint256 _parentTokenId,
        uint256[] memory _childTokenIds,
        uint256[] memory _childTokenAmounts,
        address _creator
    ) external {
        composableToken.safeBatchTransferFrom(
            _creator,
            address(composableToken),
            _childTokenIds,
            _childTokenAmounts,
            abi.encodePacked(_parentTokenId)
        );
    }
}
