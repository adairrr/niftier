// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.8.0;


import "@openzeppelin/contracts-upgradeable/introspection/ERC165CheckerUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/GSN/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "../access/AccessRestriction.sol";
import "../access/AccessRestrictable.sol";
import "./ERC1155Composable.sol";

contract ERC1155ComposableFactory is Initializable, ContextUpgradeable, AccessRestrictable {

    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address;

    event ComposableCreated(uint256 indexed _tokenId);

    ERC1155Composable public parentToken;
    ERC1155Composable public childToken;

    /*
     * TODO TODO TODO!!!!
     */
    bytes4 private constant _INTERFACE_ID_ERC1155COMPOSABLE = 0x1234abcd;

    /**
     * @notice initializer
     * @param _accessRestriction address for deployed access restriction used for access control.
     * @param _parentToken address of the parent token contract with which this factory interacts.
     * @param _childToken address of the child token contract which the parent token can hold
     */
    function initialize(
        AccessRestriction _accessRestriction,
        address _parentToken,
        address _childToken
    ) public virtual initializer {
        __ERC1155ComposableFactory_init(_accessRestriction, _parentToken, _childToken);
    }

    function __ERC1155ComposableFactory_init(
        AccessRestriction _accessRestriction,
        address _parentToken,
        address _childToken
    ) internal initializer {
        __Context_init_unchained();
        __AccessRestrictable_init_unchained(_accessRestriction);
        __ERC1155ComposableFactory_init_unchained(_parentToken, _childToken);
    }

    function __ERC1155ComposableFactory_init_unchained(
        address _parentToken,
        address _childToken
    ) internal initializer {
        require(
            ERC165CheckerUpgradeable.supportsInterface(_parentToken, _INTERFACE_ID_ERC1155COMPOSABLE)
            && ERC165CheckerUpgradeable.supportsInterface(_childToken, _INTERFACE_ID_ERC1155COMPOSABLE),
            "ERC1155ComposableFactory: parent and child contracts must support the ERC1155ComposableInterface."
        );
        parentToken = ERC1155Composable(_parentToken);
        childToken = ERC1155Composable(_childToken);
    }
}
