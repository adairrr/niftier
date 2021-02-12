// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";
import "../access/IAccessRestriction.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

/**
 * This contract handles the orchestration of the components of the artpieces. 
 * This includes:
 * - associating the Layers with the Artpieces
 * - associating the Controllers with the Layers
 */
contract ArtpieceOrchestrator is Initializable, ERC1155Upgradeable, ERC1155ReceiverUpgradeable {

        
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;
    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address;

    function initialize(address _accessRestrictionAddress, string memory _baseUri) public virtual initializer {
        __ArtpieceOrchestrator_init(_accessRestrictionAddress, _baseUri);
    }

    function __ArtpieceOrchestrator_init(address _accessRestrictionAddress, string memory _baseUri) internal initializer {
        __Context_init_unchained();
        __ERC165_init_unchained();
        __ERC1155_init_unchained(_baseUri);
        __ArtpieceOrchestrator_init_unchained(_accessRestrictionAddress, _baseUri);
    }

    function __ArtpieceOrchestrator_init_unchained(address _accessRestrictionAddress, string memory _baseUri) internal initializer {
        _setBaseUri(_baseUri);

        IAccessRestriction candidateContract =
            IAccessRestriction(_accessRestrictionAddress);
        require(candidateContract.isAccessRestriction());
        accessRestriction = candidateContract;
    }

    
    /// @dev governs access control
    IAccessRestriction accessRestriction;

    /// @dev prefix for full uri retrieval
    string private baseUri;

    /// @dev tokenId tracking
    /// TODO 
    CountersUpgradeable.Counter private _tokenIdTracker;

    /// @dev mapping to restrict which tokens can hold another
    // mapping(address => address) public childToParentContracts;
    EnumerableSetUpgradeable.AddressSet private authorizedChildContracts;


    /// @dev child contract address -> ERC1155 parent token ID -> ERC1155 child IDs owned by token ID
    // mapping(address => mapping(uint256 => EnumerableSetUpgradeable.UintSet)) parentToChildTokens;

    /// @dev Token ID -> Child contract address -> ERC1155 child Token IDs owned by Token ID -> balance
    mapping(uint256 => mapping(address => mapping(uint256 => uint256))) parentToChildBalances;

    // TODO this could be more efficient with the generation of a sort of reference ID between this and balances
    //
    mapping(uint256 => mapping(address => EnumerableSetUpgradeable.UintSet)) parentToChildTokens;


    /// @dev Child contract address -> ERC1155 child Token IDs -> TokenIDs
    /// Used for more efficient backwards lookup 
    mapping(address => mapping(uint256 => EnumerableSetUpgradeable.UintSet)) childToParentHolders;

    /// @dev mapping for token URIs
    mapping(uint256 => string) tokenUris;


    // ----------------------------------------------------------------------------
    // public/external
    // ----------------------------------------------------------------------------


    /**
     * @dev Gives balance of child given it's contract and id.
     * @param _tokenId Token ID to query
     * @param _childContract Contract for child tokens
     * @param _childTokenId Child Token ID to query
     */
    function childBalance(uint256 _tokenId, address _childContract, uint256 _childTokenId) override external view returns (uint256) {
        return parentToChildBalances[_tokenId][_childContract][_childTokenId];
    }

    /** 
     * @notice Returns an array of all the child token ids for the given token and child contract.
     * @dev Token must exist and the child contract must be authorized, otherwise will return an empty array
     * @param _tokenId Id of the token to query for children
     * @param _childContract address of the child contract for which the children are queried
      */
    function childTokensFor(uint256 _tokenId, address _childContract) override external view returns (uint256[] memory) {
        if (!_exists(_tokenId) || !authorizedChildContracts.contains(_childContract)) {
            return new uint256[](0);
        }

        uint256[] memory childTokens = new uint256[](parentToChildTokens[_tokenId][_childContract].length());

        for (uint256 i = 0; i < childTokens.length(); i++) {
            childTokens[i] = parentToChildTokens[_tokenId][_childContract].at(i);
        }

        return childTokens;
    }

    // /**
    //  * @dev Transfers child token from a token ID.
    //  * This method would be called to remove a child from a token and tranfer it to a new owner.
    //  * @param _fromTokenId The owning token to transfer from.
    //  * @param _to The address that receives the child token.
    //  * @param _childContract The ERC1155 contract of the child token.
    //  * @param _childTokenId The tokenId of the token that is being transferred.
    //  * @param _amount The amount of _childTokenId that is being tranferred.
    //  * @param _data Additional data with no specified format.
    //  */
    // function safeTransferChildFrom(
    //     uint256 _fromTokenId,
    //     address _to,
    //     address _childContract,
    //     uint256 _childTokenId,
    //     uint256 _amount,
    //     bytes memory _data
    // )
    //     public override
    // {
    //     require(_to != address(0), "Transfer to the zero address");

    //     address operator = _msgSender();
    //     require(
    //         ownerOf(_fromTokenId) == operator ||
    //         isApprovedForAll(ownerOf(_fromTokenId), operator),
    //         "Caller is neither owner nor approved"
    //     );

    //     // _beforeChildTransfer(operator, _fromTokenId, _to, _childContract, _asSingletonArray(_childTokenId), _asSingletonArray(_amount), _data);

    //     // TODO check for locked or first sale
    //     _removeChild(_fromTokenId, _childContract, _childTokenId, _amount);

    //     // TODO - ensure that the _to != this... 
    //     // call safeBatchTransferFrom on the child contract to transfer the tokens from this to _to
    //     // TODO this should check to ensure that this call is possible... ie all authorizedchildcontracts need to be compatible with this
    //     ERC1155Upgradeable(_childContract).safeTransferFrom(address(this), _to, _childTokenId, _amount, _data);
    //     emit TransferSingleChild(_fromTokenId, _to, _childContract, _childTokenId, _amount);
    // }

    // /**
    //  * @notice Batch transfer child token from top-down composable to address.
    //  * @param _fromTokenId The owning token to transfer from
    //  * @param _to The address that receives the child token
    //  * @param _childContract The ERC1155 contract of the child token
    //  * @param _childTokenIds Token ids of the child contract to transfer
    //  * @param _amounts Number of tokens for each token id in _childTokenIds to transfer
    //  * @param _data Additional data with no specified format
    //  */
    // function safeBatchTransferChildFrom(
    //     uint256 _fromTokenId, 
    //     address _to, 
    //     address _childContract, 
    //     uint256[] memory _childTokenIds, 
    //     uint256[] memory _amounts, 
    //     bytes memory _data
    // )
    //     public override
    // {
    //     require(_childTokenIds.length == _amounts.length, "ERC998: _childTokenIds and _amounts length mismatch");
    //     require(_to != address(0), "ERC998: transfer to the zero address");

    //     address operator = _msgSender();
    //     require(
    //         ownerOf(_fromTokenId) == operator ||
    //         isApprovedForAll(ownerOf(_fromTokenId), operator),
    //         "ERC998: caller is neither owner nor approved"
    //     );

    //     // _beforeChildTransfer(operator, _fromTokenId, _to, _childContract, _childTokenIds, _amounts, _data);

    //     // loop through the 
    //     for (uint256 i = 0; i < _childTokenIds.length; ++i) {
    //         uint256 childTokenId = _childTokenIds[i];
    //         uint256 amount = _amounts[i];

    //         _removeChild(_fromTokenId, _childContract, childTokenId, amount);
    //     }
    //     // call safeBatchTransferFrom on the child contract to transfer the tokens from this to _to
    //     ERC1155Upgradeable(_childContract).safeBatchTransferFrom(address(this), _to, _childTokenIds, _amounts, _data);
    //     emit TransferBatchChild(_fromTokenId, _to, _childContract, _childTokenIds, _amounts);
    // }


    /**
     * @notice A token receives a child token
     *  - The receiver token's ID must be encoded in _data!
     *  - Enforces children token binding to parent token
     * msg.sender is the childContract address!!
     * @param _operator The address that caused the transfer.
     * @param _from The owner of the child token.
     * @param _childTokenId The token that is being transferred to the parent.
     * @param _amount The amount of tokens being received.
     * @param _data Up to the first 32 bytes contains the recipient parent tokenId.  
     * @return onERC1155Recieved selector
     */
    function onERC1155Received(
        address _operator,
        address _from,
        uint256 _childTokenId,
        uint256 _amount,
        bytes memory _data
    )
        virtual
        external
        override
        returns (bytes4) 
    {
        // check that the _data can support the recipient token ID
        require(_data.length == 32, "ERC998: data must contain the unique uint256 tokenId to transfer the child token to");

        uint256 _recipientTokenId = _loadRecipientTokenId();
        _validateRecipientParams(_recipientTokenId, _operator, _from);

        _receiveChild(_recipientTokenId, _msgSender(), _childTokenId, _amount);

        emit ReceivedChild(_from, _recipientTokenId, _msgSender(), _childTokenId, _amount);

        // TODO possibly limit number of tokens for chhildren

        return this.onERC1155Received.selector;
    }

    /**
     @notice Batch ERC1155 receiver callback hook, used to enforce child token bindings to a given parent token ID
     *  - The receiver token's ID must be encoded in _data!
     *  - Enforces children token binding to parent token
     * msg.sender is the childContract address!!
     * @param _operator The address that caused the transfer.
     * @param _from The owner of the child token.
     * @param _childTokenIds The tokens that are being transferred to the parent.
     * @param _amounts The amount of tokens being received.
     * @param _data Up to the first 32 bytes contains the recipient parent tokenId.  
     * @return onERC1155Recieved selector
     */
    function onERC1155BatchReceived(
        address _operator, 
        address _from, 
        uint256[] memory _childTokenIds, 
        uint256[] memory _amounts, 
        bytes memory _data
    )
        virtual
        external
        override
        returns (bytes4) 
    {
        // check that the _data can support the recipient token ID
        require(_data.length == 32, "ERC998: data must contain the unique uint256 tokenId to transfer the child token to");

        uint256 _recipientTokenId = _loadRecipientTokenId();
        _validateRecipientParams(_recipientTokenId, _operator, _from);

        // Note: be mindful of GAS limits
        for (uint256 i = 0; i < _childTokenIds.length; i++) {
            _receiveChild(_recipientTokenId, _msgSender(), _childTokenIds[i], _amounts[i]);
        }

        emit ReceivedChildBatch(_from, _recipientTokenId, _msgSender(), _childTokenIds, _amounts);

        return this.onERC1155BatchReceived.selector;
    }
    

    

    /**
     * @dev Takes the msg.data and extracts the embedded recipient token's ID.
     */
    function _loadRecipientTokenId() internal pure returns (uint256) {
        uint256 _recipientTokenId;
        uint256 _index = msg.data.length - 32;
        assembly {_recipientTokenId := calldataload(_index)}
        return _recipientTokenId;
    }

    /**
     * @dev Validates:
     *  - Recipient token exists
     *  - Child contract has been authorized
     *  - Sender (_from) owns _recipient token if not newly minted
     * @param _recipientTokenId Token ID to transfer the child to
     * @param _operator The address that caused the transfer.
     * @param _from Address for whom this transfer was initiated.
     */
    function _validateRecipientParams(uint256 _recipientTokenId, address _operator, address _from) internal view {
        require(_exists(_recipientTokenId), "Recipient token does not exist.");

        // Require prior authorization to accept tokens 
        require(authorizedChildContracts.contains(_msgSender()), "This contract has not been authorized to receive this token.");

        // Sender must be owner OR newly minted
        if (_from != address(0)) {
            require(
                ownerOf(_recipientTokenId) == _from,
                "Only the owner of the parent token may add aditional child tokens."
            );

            // Ensure approved addresses cannot transfer child tokens.
            require(_operator == _from, "Operator is not owner");
        }
    }

    // ----------------------------------------------------------------------------
    // private
    // ----------------------------------------------------------------------------

    /**
     * @dev Receives a child token.
     * @param _tokenId Id of the token that is receiving the child
     * @param _childContract address of the child contract for the token to be received
     * @param _childTokenId id of the child token of the _childContract to be received
     * @param _amount amount of the _childTokenIds to be received
     */
    function _receiveChild(uint256 _tokenId, address _childContract, uint256 _childTokenId, uint256 _amount) private {
        require(_amount > 0, "Must be receiving at least one child token.");
        // TODO sanity check for authorized child contracts?

        // Add the child token to the parent token's balance
        uint256 memory finalBalance = parentToChildBalances[_tokenId][_childContract][_childTokenId] = 
            parentToChildBalances[_tokenId][_childContract][_childTokenId].add(_amount);
        
        // Add the parent token's ID to holders of the child token ID if it was not there before.
        if (finalBalance == _amount) {
           childToParentHolders[_childContract][_childTokenId].add(_tokenId);
           parentToChildTokens[_tokenId][_childContract].add(_childTokenId);
        }
    }

    /**
     * @dev 
     * @param _tokenId Id of the token that is having the child removed
     * @param _childContract address of the child contract for the token to be removed
     * @param _childTokenId id of the child token of the _childContract to be removed
     * @param _amount amount of the _childTokenIds to be removed
     */
    function _removeChild(uint256 _tokenId, address _childContract, uint256 _childTokenId, uint256 _amount) private {
        require(_amount != 0 || parentToChildBalances[_tokenId][_childContract][_childTokenId] >= _amount, 
            "ERC998: insufficient child balance for transfer");


        uint256 memory finalBalance = parentToChildBalances[_tokenId][_childContract][_childTokenId] = 
            parentToChildBalances[_tokenId][_childContract][_childTokenId].sub(_amount);
        
        // remove the token from the holders if it is no longer a holder of the child token
        if (finalBalance == 0) {
            childToParentHolders[_childContract][_childTokenId].remove(_tokenId);
            parentToChildTokens[_tokenId][_childContract].remove(_childTokenId);
        }
    }

    // ----------------------------------------------------------------------------
    // onlyAdmin
    // ----------------------------------------------------------------------------


    /**
     * @notice Update the access restriction for new deploments or other.
     * @dev onlyAdmin
     * @param _accessRestriction new AccessRestriction address
     */
    function updateAccessRestriction(IAccessRestriction _accessRestriction) external {
        require(accessRestriction.ifAdmin(_msgSender()), "ArpieceOrchestrator.updateAccessRestriction: Sender must be admin");
        accessRestriction = _accessRestriction;
    }

    
    function setBaseUri(string memory _baseUri) external {
        accessRestriction.ifAdmin(msg.sender);
        _setBaseUri(_baseUri);
    }

    /**
     * @notice Updates the URI of a token represented by this contract.
     * @dev Only admin
     * @param _tokenId The ID of the token being updated
     * @param _tokenUri The new URI
     */
    function setTokenUri(uint256 _tokenId, string calldata _tokenUri) external {
        require(
            accessRestriction.ifAdmin(_msgSender()),
            "ArpieceOrchestrator.setTokenUri: Sender must be admin to set URI."
        );
        _setTokenUri(_tokenId, _tokenUri);
        emit UriUpdated(_tokenId, _tokenUri);
    }

    /**
     * @notice Updates the URI of a token represented by this contract.
     * @dev Token must exist
     * @param _tokenId The ID of the token being updated
     * @param _tokenUri The new URI
     */
    function _setTokenUri(uint256 _tokenId, string memory _tokenUri) internal {
        require(_exists(_tokenId), "URI set of nonexistent token");
        tokenUris[_tokenId] = _tokenUri;
    }

    function _setBaseUri(string memory _baseUri) internal {
        baseUri = _baseUri;
    }
}
