// SPDX-License-Identifier: UNLICENSED
// Modified from https://github.com/rocksideio/ERC998-ERC1155-TopDown/blob/b4d985b7e7d73f9b7759e0a408f528cd5c66b571/contracts/IERC998ERC1155TopDown.sol
pragma experimental ABIEncoderV2;
pragma solidity >=0.7.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155ReceiverUpgradeable.sol";

interface IERC1155Composable is IERC1155Upgradeable, IERC1155ReceiverUpgradeable {

    event ReceivedChildToken(
        address indexed operator,
        address indexed from, 
        uint256 indexed recipientTokenId, 
        address childContract, 
        uint256 childTokenId, 
        uint256 amount
    );

    event ReceivedChildTokenBatch(
        address indexed operator,
        address indexed from, 
        uint256 indexed recipientTokenId, 
        address childContract, 
        uint256[] childTokenIds, 
        uint256[] amounts
    );

    event TransferChildToken(
        address indexed operator,
        uint256 indexed fromTokenId, 
        address indexed to, 
        address childContract, 
        uint256 childTokenId, 
        uint256 amount
    );
    
    event TransferChildTokenBatch(
        address indexed operator,
        uint256 indexed fromTokenId, 
        address indexed to, 
        address childContract, 
        uint256[] childTokenIds, 
        uint256[] amounts
    );

    event AssociateChildToken(
        uint256 indexed toTokenId,
        address indexed childContract,
        uint256 indexed childTokenId
    );

    event DisassociateChildToken(
        uint256 indexed fromTokenId,
        address indexed childContract,
        uint256 indexed childTokenId
    );

    event Mint(
        address indexed operator,
        address indexed to,
        uint256 tokenId,
        uint256 amount,
        address indexed creator
    );

    event MintBatch(
        address indexed operator,
        address indexed to,
        uint256[] tokenIds,
        uint256[] amounts,
        address indexed creator
    );

    function childTokensOf(uint256 _tokenId, address _childContract) external view returns (uint256[] memory childTokens);

    function parentTokensOf(address _childContract, uint256 _tokenId) external view returns (uint256[] memory parentTokens);

    function childBalance(uint256 tokenId, address childContract, uint256 childTokenId) external view returns(uint256);

    function safeTransferChildFrom(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId, uint256 _amount, bytes memory _data) external;

    function safeBatchTransferChildFrom(uint256 _fromTokenId, address _to, address _childContract, uint256[] memory _childTokenIds, uint256[] memory _amounts, bytes memory _data) external;
}
