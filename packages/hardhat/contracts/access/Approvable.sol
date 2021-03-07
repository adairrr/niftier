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
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    function __Approvable_init() internal initializer {
        __Context_init_unchained();
        __Approvable_init_unchained();
    }

    function __Approvable_init_unchained() internal initializer {
    }

    // Mapping from token ID to approved addresses
    mapping (address => EnumerableSetUpgradeable.UintSet) private tokenApprovals;

    /**
     * @dev Emitted when `operator` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed operator, address indexed approved, uint256 indexed tokenId);

    event BatchApproval(address indexed operator, address indexed approved, uint256[] tokenIds);

    event TransferApproval(address operator, address indexed fromApproved, address indexed toApproved, uint256 indexed tokenId);

    modifier _onlyApproved(uint256 _tokenId) {
        require(
            tokenApprovals[_msgSender()].contains(_tokenId),
            "Caller is not approved"
        );
        _;
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

    // /**
    //  * @dev Get approved addresses for a given token.
    //  */
    // function getApproved(uint256 _tokenId) public virtual view returns (address[] memory approved) {
    //     approved = new address[](tokenApprovals[_tokenId].length());

    //     for (uint256 i; i < tokenApprovals[_tokenId].length(); i++) {
    //         approved[i] = tokenApprovals[_tokenId].at(i);
    //     }
    // }

    function getApprovedTokenByIndex(address _forWhom, uint256 _index) external view returns(uint256) {
        return tokenApprovals[_forWhom].at(_index);
    }

    function approvalCount(address _forWhom) external view returns(uint256) {
        return tokenApprovals[_forWhom].length();
    }
    
    /** 
     * @notice same as approve, just doesn't check for prior approvals
     */
    function approveAtMint(address _to, uint256 _tokenId) internal virtual {
        _approve(_to, _tokenId);
    }

    /** 
     * @notice same as approve, just doesn't check for prior approvals
     */
    function approveAtBatchMint(address _to, uint256[] memory _tokenIds) internal virtual {
        _approveBatch(_to, _tokenIds);
    }

    function _approve(address _to, uint256 _tokenId) private {
        tokenApprovals[_to].add(_tokenId);
        emit Approval(_msgSender(), _to, _tokenId);
    }

    function _approveBatch(address _to, uint256[] memory _tokenIds) private {
        EnumerableSetUpgradeable.UintSet storage approvalSet = tokenApprovals[_to];
        for (uint256 i; i < _tokenIds.length; ++i) {
            approvalSet.add(_tokenIds[i]);
        }
        emit BatchApproval(_msgSender(), _to, _tokenIds);
    }
    
    function _transferApproval(address _fromApproved, address _toApproved, uint256 _tokenId) private {
        tokenApprovals[_fromApproved].remove(_tokenId);
        tokenApprovals[_toApproved].add(_tokenId);
        emit TransferApproval(_msgSender(), _fromApproved, _toApproved, _tokenId);
    }
}
