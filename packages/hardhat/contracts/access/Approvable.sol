// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";
import "./AccessRestriction.sol";

/**
 * @notice Abstract class representing token approvals.
 */
abstract contract Approvable is Initializable, ContextUpgradeable {

    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    function __Approvable_init() internal initializer {
        __Context_init_unchained();
        __Approvable_init_unchained();
    }

    function __Approvable_init_unchained() internal initializer {
    }

    // Mapping from token ID to approved addresses
    mapping (uint256 => EnumerableSetUpgradeable.AddressSet) private tokenApprovals;

    /**
     * @dev Emitted when `operator` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed operator, address indexed approved, uint256 indexed tokenId);

    event TransferApproval(address operator, address indexed fromApproved, address indexed toApproved, uint256 indexed tokenId);

    modifier _onlyApproved(uint256 _tokenId) {
        require(
            tokenApprovals[_tokenId].contains(_msgSender()),
            "Caller is not approved"
        );
        _;
    }

    /** 
     * @notice same as approve, just doesn't check for prior approvals
     */
    function approveAtMint(address _to, uint256 _tokenId) internal virtual {
        _approve(_to, _tokenId);
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address _to, uint256 _tokenId) public virtual _onlyApproved(_tokenId) {
        _approve(_to, _tokenId);
    }

    
    function transferApproval(
        address _fromApproved, 
        address _toApproved, 
        uint256 _tokenId
    ) internal {
        _transferApproval(_fromApproved, _toApproved, _tokenId);
    }

    /**
     * @dev Get approved addresses for a given token.
     */
    function getApproved(uint256 _tokenId) public virtual view returns (address[] memory approved) {
        approved = new address[](tokenApprovals[_tokenId].length());

        for (uint256 i; i < tokenApprovals[_tokenId].length(); i++) {
            approved[i] = tokenApprovals[_tokenId].at(i);
        }
    }

    function _approve(address _to, uint256 _tokenId) private {
        tokenApprovals[_tokenId].add(_to);
        emit Approval(_msgSender(), _to, _tokenId);
    }
    
    function _transferApproval(address _fromApproved, address _toApproved, uint256 _tokenId) private {
        tokenApprovals[_tokenId].remove(_fromApproved);
        tokenApprovals[_tokenId].add(_toApproved);
        emit TransferApproval(_msgSender(), _fromApproved, _toApproved, _tokenId);
    }
}
