// SPDX-License-Identifier: UNLICENSED
// Modified from https://github.com/rocksideio/ERC998-ERC1155-TopDown/blob/b4d985b7e7d73f9b7759e0a408f528cd5c66b571/contracts/IERC998ERC1155TopDown.sol
pragma solidity >=0.6.0 <0.8.0;

// Remix imports
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface IERC998ERC1155TopDown is IERC721Upgradeable, IERC1155ReceiverUpgradeable {
    event ReceivedChild(address indexed from, uint256 indexed toTokenId, address indexed childContract, uint256 childTokenId, uint256 amount);
    event TransferSingleChild(uint256 indexed fromTokenId, address indexed to, address indexed childContract, uint256 childTokenId, uint256 amount);
    event TransferBatchChild(uint256 indexed fromTokenId, address indexed to, address indexed childContract, uint256[] childTokenIds, uint256[] amounts);

    function childContractsFor(uint256 tokenId) external view returns (address[] memory childContracts);
    function childIdsForContract(uint256 tokenId, address childContract) external view returns (uint256[] memory childIds);
    function childBalance(uint256 tokenId, address childContract, uint256 childTokenId) external view returns(uint256);

    function safeTransferChildFrom(uint256 fromTokenId, address to, address childContract, uint256 childTokenId, uint256 amount, bytes calldata data) external;
    function safeBatchTransferChildFrom(uint256 fromTokenId, address to, address childContract, uint256[] calldata childTokenIds, uint256[] calldata amounts, bytes calldata data) external;
}
