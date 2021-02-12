// SPDX-License-Identifier: UNLICENSED
// Modified from https://github.com/rocksideio/ERC998-ERC1155-TopDown/blob/f577aa1b938bb003e84ac4612abb59916b561a0e/contracts/ERC998ERC1155TopDown.sol
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";

import "./IERC998ERC1155TopDown.sol";

abstract contract ERC998ERC1155TopDown is ERC721Upgradeable, ERC1155ReceiverUpgradeable, IERC998ERC1155TopDown {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet; 

    // ERC721 Token Id => ERC1155 contract address => ERC1155 token ids => amount
    mapping(uint256 => mapping(address => mapping(uint256 => uint256))) private childContractBalances;
    // ERC1155 Token Id => ERC721 Token Id that have a balance
    mapping(address => mapping(uint256 => EnumerableSetUpgradeable.UintSet)) private holdersOf;

    // ERC721 Token Id => ERC1155 contract addresses
    mapping(uint256 => EnumerableSetUpgradeable.AddressSet) private childContract;
    // ERC721 Token Id => ERC1155 contract address => ERC1155 token ids
    mapping(uint256 => mapping(address => EnumerableSetUpgradeable.UintSet)) private childsForChildContract;


    /**
     * @dev Gives child balance for a specific child contract and child id .
     * @param _tokenId
     * @param _childContract
     * @param _childTokenId
     */
    function childBalance(
        uint256 _tokenId,
        address _childContract, 
        uint256 _childTokenId
    ) 
        external view override 
        returns(uint256) 
    {
        return childContractBalances[_tokenId][_childContract][_childTokenId];
    }

    /**
     * @dev Returns a list of child contracts associated with the _tokenId
     * @param _tokenId 
     */
    function childContractsFor(uint256 _tokenId) override external view returns (address[] memory) {
        address[] memory childContracts = new address[](childContract[_tokenId].length());

        for(uint256 i = 0; i < childContract[_tokenId].length(); i++) {
            childContracts[i] = childContract[_tokenId].at(i);
        }

        return childContracts;
    }

    /**
     * @dev Gives list of owned child ID on a child contract by token ID.
     */
    function childIdsForContract(uint256 _tokenId, address _childContract) override external view returns (uint256[] memory) {
        uint256[] memory childTokenIds = new uint256[](childsForChildContract[_tokenId][_childContract].length());

        for(uint256 i = 0; i < childsForChildContract[_tokenId][_childContract].length(); i++) {
            childTokenIds[i] = childsForChildContract[_tokenId][_childContract].at(i);
        }

        return childTokenIds;
    }


    /**
     * @dev Transfers child token from a token ID.
     * @param _fromTokenId The owning token to transfer from.
     * @param _to The address that receives the child token.
     * @param _childContract The ERC1155 contract of the child token.
     * @param _childTokenId The tokenId of the token that is being transferred.
     * @param _amount The amount of _childTokenId that is being tranferred.
     * @param _data Additional data with no specified format.
     */
    function safeTransferChildFrom(
        uint256 _fromTokenId, 
        address _to,
        address _childContract, 
        uint256 _childTokenId, 
        uint256 _amount, 
        bytes memory _data
    )
        public override
    {
        require(_to != address(0), "ERC998: transfer to the zero address");

        address operator = _msgSender();
        require(
            ownerOf(_fromTokenId) == operator ||
            isApprovedForAll(ownerOf(_fromTokenId), operator),
            "ERC998: caller is not owner nor approved"
        );

        _beforeChildTransfer(operator, _fromTokenId, _to, _childContract, _asSingletonArray(_childTokenId), _asSingletonArray(_amount), _data);

        _removeChild(_fromTokenId, _childContract, _childTokenId, _amount);

        // TODO - ensure that the _to != this... 
        // call safeBatchTransferFrom on the child contract to transfer the tokens from this to _to
        ERC1155(_childContract).safeTransferFrom(address(this), _to, _childTokenId, _amount, _data);
        emit TransferSingleChild(_fromTokenId, _to, _childContract, _childTokenId, _amount);
    }

    /**
     * @notice Batch transfer child token from top-down composable to address.
     * @param _fromTokenId The owning token to transfer from
     * @param _to The address that receives the child token
     * @param _childContract The ERC1155 contract of the child token
     * @param _childTokenIds Token ids of the child contract to transfer
     * @param _amounts Number of tokens for each token id in _childTokenIds to transfer
     * @param _data Additional data with no specified format
     */
    function safeBatchTransferChildFrom(
        uint256 _fromTokenId, 
        address _to, 
        address _childContract, 
        uint256[] memory _childTokenIds, 
        uint256[] memory _amounts, 
        bytes memory _data
    )
        public override
    {
        require(_childTokenIds.length == _amounts.length, "ERC998: _childTokenIds and _amounts length mismatch");
        require(_to != address(0), "ERC998: transfer to the zero address");

        address operator = _msgSender();
        require(
            ownerOf(_fromTokenId) == operator ||
            isApprovedForAll(ownerOf(_fromTokenId), operator),
            "ERC998: caller is neither owner nor approved"
        );

        _beforeChildTransfer(operator, _fromTokenId, _to, _childContract, _childTokenIds, _amounts, _data);

        // loop through the 
        for (uint256 i = 0; i < _childTokenIds.length; ++i) {
            uint256 childTokenId = _childTokenIds[i];
            uint256 amount = _amounts[i];

            _removeChild(_fromTokenId, _childContract, childTokenId, amount);
        }
        // call safeBatchTransferFrom on the child contract to transfer the tokens from this to _to
        ERC1155(_childContract).safeBatchTransferFrom(address(this), _to, _childTokenIds, _amounts, _data);
        emit TransferBatchChild(_fromTokenId, _to, _childContract, _childTokenIds, _amounts);
    }

    /**
     * @dev 
     * @param _tokenId Id of the token that is receiving the child
     * @param _childContract address of the chlid contract to be received
     * @param _childTokenId id of the child token of the _childContract to be received
     * @param _amount amount of the _childTokenIds to be received
     */
    function _receiveChild(uint256 _tokenId, address _childContract, uint256 _childTokenId, uint256 _amount) internal virtual {
        // add the tokend
        if(!childContract[_tokenId].contains(_childContract)) {
            childContract[_tokenId].add(_childContract);
        }

        // 
        if (childContractBalances[_tokenId][_childContract][_childTokenId] == 0) {
            childsForChildContract[_tokenId][_childContract].add(_childTokenId);
        }
        childContractBalances[_tokenId][_childContract][_childTokenId] += _amount;
    }

    /**
     * @dev
     * @param _tokenId Id of the token that is getting the child removed
     * @param _childContract address of the child contract to be removed
     * @param _childTokenId id of cthe child token of the _childContract to be removed
     * @param _amount amount of the _childTokenIds to be removed.
     */
     function _removeChild(uint256 _tokenId, address _childContract, uint256 _childTokenId, uint256 _amount) internal virtual {
        require(_amount != 0 || childContractBalances[_tokenId][_childContract][_childTokenId] >= _amount, "ERC998: insufficient child balance for transfer");
        // subtract the amount of _childTokenIds from the balance of _tokenId
        childContractBalances[_tokenId][_childContract][_childTokenId] -= _amount;
        if(childContractBalances[_tokenId][_childContract][_childTokenId] == 0) {
            // Remove the _tokenId from holders of the _childTokenId since the balance is 0
            holdersOf[_childContract][_childTokenId].remove(_tokenId);
            childsForChildContract[_tokenId][_childContract].remove(_childTokenId);

            // if there are no tokens under the _childContract for this _tokenId, remove its reference.
            if(childsForChildContract[_tokenId][_childContract].length() == 0) {
                childContract[_tokenId].remove(_childContract);
            }
        }
    }

    /**
     * @notice A token receives a child token
     * @param _operator The address that caused the transfer.
     * @param _from The owner of the child token.
     * @param _childTokenId The token that is being transferred to the parent.
     * @param _amount The amount of tokens being received.
     * @param _data Up to the first 32 bytes contains an integer which is the receiving parent tokenId.  
     */
    function onERC1155Received(
        address _operator, 
        address _from, 
        uint256 _childTokenId, 
        uint256 _amount, 
        bytes memory _data
    ) 
        virtual public override 
        returns(bytes4) 
    {
        require(_data.length == 32, "ERC998: data must contain the unique uint256 tokenId to transfer the child token to");
        _beforeChildTransfer(_operator, 0, address(this), _from, _asSingletonArray(_childTokenId), _asSingletonArray(_amount), _data);

        uint256 _receiverTokenId;
        uint256 _index = msg.data.length - 32;
        assembly {_receiverTokenId := calldataload(_index)}

        require(_exists(_receiverTokenId), "Token does not exist");

        _receiveChild(_receiverTokenId, msg.sender, _childTokenId, _amount);
        emit ReceivedChild(_from, _receiverTokenId, msg.sender, _childTokenId, _amount);

        return this.onERC1155Received.selector;
    }

    /**
     * @notice A token receives a batch of child tokens.
     * @param _operator The address that caused the transfer.
     * @param _from The owner of the child token.
     * @param _childTokenId The token that is being transferred to the parent.
     * @param _amounts The amount of tokens being received.
     * @param _data Up to the first 32 bytes contains an integer which is the receiving parent tokenId.  
     */
    function onERC1155BatchReceived(
        address _operator, 
        address _from, 
        uint256[] memory _childTokenIds, 
        uint256[] memory _amounts, 
        bytes memory _data
    )
        virtual public override 
        returns(bytes4) 
    {
        require(_data.length == 32, "ERC998: data must contain the unique uint256 tokenId to transfer the child token to");
        require(_childTokenIds.length == _amounts.length, "ERC1155: ids and values length mismatch");
        _beforeChildTransfer(_operator, 0, address(this), _from, _childTokenIds, _amounts, _data);

        uint256 _receiverTokenId;
        uint256 _index = msg.data.length - 32;
        assembly {_receiverTokenId := calldataload(_index)}

        require(_exists(_receiverTokenId), "Token does not exist");

        for(uint256 i = 0; i < _childTokenIds.length; i++) {
            _receiveChild(_receiverTokenId, msg.sender, _childTokenIds[i], _amounts[i]);
            emit ReceivedChild(_from, _receiverTokenId, msg.sender, _childTokenIds[i], _amounts[i]);
        }
        return this.onERC1155BatchReceived.selector;
    }



    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
    */
    function _beforeChildTransfer(
        address operator,
        uint256 fromTokenId,
        address to,
        address childContract,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
        internal virtual
    { }

    function _asSingletonArray(uint256 element) private pure returns (uint256[] memory) {
        uint256[] memory array = new uint256[](1);
        array[0] = element;

        return array;
    }
    uint256[41] private __gap;
}
