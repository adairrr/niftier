// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable//GSN/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

/**
 * @dev Contract module that allows children to implement types.
 *
 * Types are referred to by their `bytes32` identifier. These should be exposed
 * in the external API and be unique. The best way to achieve this is by
 * using `public constant` hash digests:
 *
 * ```
 * bytes32 public constant MY_TYPE = keccak256("MY_TYPE");
 * ```
 *
 * Types can be used to represent a set of permissions. To restrict access to a
 * function call, use {isType}:
 *
 * ```
 * function foo() public {
 *     require(isType(MY_TYPE, tokenId));
 *     ...
 * }
 * ```
 *
 * Types can be associated and disassociated dynamically via the {associateType} and
 * {disassociateType} functions. Only the smart contract itself can call these methods.
 */
abstract contract TokenTypeUpgradeable is Initializable, ContextUpgradeable {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;
    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address;

    address public typeCreatorRole;

    function __TokenType_init(address _typeCreator) internal initializer {
        __Context_init_unchained();
        __TokenType_init_unchained(_typeCreator);
    }

    function __TokenType_init_unchained(address _typeCreator) internal initializer {
        typeCreatorRole = _typeCreator;
    }

    struct TokenTypeData {
        EnumerableSetUpgradeable.UintSet tokens;
        // TODO possible to add subtypes?
    }

    mapping (bytes32 => TokenTypeData) private tokenTypes;


    /**
     * @dev Emitted when `_tokenId` is associated to `_tokenType`.
     *
     * TODO is this sender required?
     * `sender` is the account that originated the contract call, an admin role
     * bearer except when using {_setupRole}.
     */
    event TypeAssociated(bytes32 indexed _tokenType, uint256 indexed _tokenId, address indexed sender);

    /**
     * @dev Emitted when `_tokenId` is dissassociated from `_tokenType`.
     *
     * `sender` is the account that originated the contract call:
     *   - if using `revokeRole`, it is the admin role bearer
     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
     */
    event TypeDisassociated(bytes32 indexed _tokenType, uint256 indexed _tokenId, address indexed sender);

    /**
     * @dev Returns `true` if `_tokenId` is of type `_tokenType`.
     */
    function isType(bytes32 _tokenType, uint256 _tokenId) public view returns (bool) {
        return tokenTypes[_tokenType].tokens.contains(_tokenId);
    }

    /**
     * @dev Returns the number of tokens that are of type `_tokenType`. Can be used
     * together with {getTokenWithType} to enumerate all tokens of a type.
     */
    function getTokenTypeCount(bytes32 _tokenType) public view returns (uint256) {
        return tokenTypes[_tokenType].tokens.length();
    }

    /**
     * @dev Returns one of the token ids that have `_tokenType`. `index` must be a
     * value between 0 and {getTypeTokenCount}, non-inclusive.
     *
     * Typed tokens are not sorted in any particular way, and their ordering may
     * change at any point.
     */
    function getTokenWithType(bytes32 _tokenType, uint256 index) public view returns (uint256) {
        return tokenTypes[_tokenType].tokens.at(index);
    }

    /**
     * @dev Associates `_tokenType` to `_tokenId`.
     *
     * If `_tokenId` had not been already granted `_tokenType`, emits a {TypeAssociated}
     * event.
     */
    function associateType(bytes32 _tokenType, uint256 _tokenId) public virtual {
        require(typeCreatorRole == _msgSender(), "TokenType: sender must be an typeCreator to associate");

        _associateType(_tokenType, _tokenId);
    }

    /**
     * @dev Disassociates `_tokenId` from `_tokenType`.
     *
     * If `_tokenId` had been associated `_tokenType`, emits a {TypeDisassociated} event.
     */
    function disassociateType(bytes32 _tokenType, uint256 _tokenId) public virtual {
        require(typeCreatorRole == _msgSender(), "TokenType: sender must be an typeCreator to disassociate");

        _disassociateType(_tokenType, _tokenId);
    }

    /**
     * @dev Associates `_tokenType` to `_tokenId`.
     *
     * If `_tokenId` had not been already associated with `_tokenType`, emits a {TypeAssociated}
     * event. Note that unlike {associateType}, this function doesn't perform any
     * checks on the calling account.
     */
    function _setupType(bytes32 _tokenType, uint256 _tokenId) internal virtual {
        _associateType(_tokenType, _tokenId);
    }

    function _associateType(bytes32 _tokenType, uint256 _tokenId) private {
        if (tokenTypes[_tokenType].tokens.add(_tokenId)) {
            emit TypeAssociated(_tokenType, _tokenId, _msgSender());
        }
    }

    function _disassociateType(bytes32 _tokenType, uint256 _tokenId) private {
        if (tokenTypes[_tokenType].tokens.remove(_tokenId)) {
            emit TypeDisassociated(_tokenType, _tokenId, _msgSender());
        }
    }

    uint256[49] private __gap;
}
