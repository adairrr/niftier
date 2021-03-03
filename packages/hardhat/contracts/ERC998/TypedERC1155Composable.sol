// SPDX-License-Identifier: UNLICENSED
pragma experimental ABIEncoderV2;
pragma solidity >=0.7.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableMapUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/introspection/ERC165CheckerUpgradeable.sol";
import "../access/AccessRestriction.sol";
import "../access/AccessRestrictable.sol";
import "../access/Approvable.sol";
import "./IERC1155Composable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

// testing 
import "hardhat/console.sol";

/**
 * This contract handles represents an ERC1155 token that can hold ERC1155 tokens.
 */
contract TypedERC1155Composable is Initializable, ERC1155Upgradeable, ERC1155ReceiverUpgradeable, IERC1155Composable, AccessRestrictable, Approvable {

    using CountersUpgradeable for CountersUpgradeable.Counter;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;
    using EnumerableMapUpgradeable for EnumerableMapUpgradeable.UintToAddressMap;
    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address;

    /*
     * TODO TODO TODO!!!!
     */
    bytes4 private constant _INTERFACE_ID_ERC1155COMPOSABLE = 0x1234abcd;

    /// @dev prefix for uri retrieval
    string public baseUri;

    /// @dev name of this token
    string public name;

    /// @dev tokenId tracking
    /// TODO 
    CountersUpgradeable.Counter private tokenIdTracker;

    /// @dev mapping to restrict which tokens can hold another
    // mapping(address => address) public childToParentContracts;
    EnumerableSetUpgradeable.AddressSet private authorizedChildContracts;

    /// @dev Used to keep track of all the tokens represented by this contract
    mapping(uint256 => uint256) public tokenSupply;

    /// @dev mapping for token URIs TODO this should be bytes32? with base58mod
    mapping(uint256 => string) public tokenUris;

    struct TokenType {
        bytes32 tokenTypeName;
        uint256 childTypesBitmap;
    }

    /// @dev Counter to track the current index of the token Types
    CountersUpgradeable.Counter private tokenTypeCounter;

    /// @dev array of TokenType structs, indexed
    TokenType[256] public tokenTypes;

    /// @dev mapping from TokenTypeName -> TokenType index in tokenTypes
    mapping(bytes32 => uint256) public tokenTypeNameToId;

    mapping(uint256 => address) public tokenCreators;

    /// @dev Token ID -> Child contract address -> ERC1155 child Token IDs owned by Token ID -> balance
    mapping(uint256 => mapping(address => mapping(uint256 => uint256))) parentToChildBalances;

    // TODO this could be more efficient with the generation of a sort of reference ID between this and balances
    mapping(uint256 => mapping(address => EnumerableSetUpgradeable.UintSet)) parentToChildTokens;

    /// @dev Child contract address -> ERC1155 child Token IDs -> TokenIDs
    /// Used for more efficient backwards lookup 
    mapping(address => mapping(uint256 => EnumerableSetUpgradeable.UintSet)) childToParentHolders;

    /// @dev store the type of the token in the upper 16 bits
    uint256 public constant TOKEN_TYPE_SHIFT = 240;
    uint256 public constant TOKEN_TYPE_MASK = uint256(~0) << TOKEN_TYPE_SHIFT;

    event BaseUriUpdated(string _baseUri);
    // TODO this will be per type!!
    event TokenNameUpdated(string _name);
    event TokenTypesCreated(bytes32[] _tokenTypeNames, uint256[] tokenTypeIds);
    event ChildTypeAuthorized(uint256 _parentType, uint256 _childType);
    event UriUpdated(uint256 indexed _tokenId, string _tokenUri);

    uint256 private pendingInternalRecipientId;
    modifier cachedInternalTransfer(bytes memory _data) {
        // check that data may support uint256
        if (_data.length == 32) {
            require(pendingInternalRecipientId == 0, "Reentrant call");
            assembly {
                // test := mload(add(_data, add(0x20, 0)))
                sstore(pendingInternalRecipientId.slot, mload(add(_data, add(0x20, 0))))
            }
        }
        _;
        pendingInternalRecipientId = 0;
    }

    /**
     * @notice initializer
     * @param _accessRestriction address for deployed access restriction used for access control.
     * @param _name Name of the token that this contract will represent.
     * @param _baseUri base URI for all tokens represented by this contract.
     */
    function initialize(
        AccessRestriction _accessRestriction,
        string memory _name,
        string memory _baseUri
    ) public virtual initializer {
        __ERC1155Composable_init(_accessRestriction, _name, _baseUri);
    }

    function __ERC1155Composable_init(
        AccessRestriction _accessRestriction,
        string memory _name,
        string memory _baseUri
    ) internal initializer {
        __Context_init_unchained();
        __ERC165_init_unchained();
        __ERC1155_init_unchained(_baseUri);
        __AccessRestrictable_init_unchained(_accessRestriction);
        __Approvable_init_unchained();
        __ERC1155Composable_init_unchained(_name, _baseUri);
    }

    function __ERC1155Composable_init_unchained(
        string memory _name,
        string memory _baseUri
    ) internal initializer {
        _setName(_name);
        _setBaseUri(_baseUri);

        // register the supported interfaces to conform to TypedERC1155Composable via ERC165
        _registerInterface(_INTERFACE_ID_ERC1155COMPOSABLE);
    }

    // ----------------------------------------------------------------------------
    // public/external
    // ----------------------------------------------------------------------------

    /**
      * @notice Mints an TypedERC1155Composable Token 
      * @dev Only minter may call this 
      * @param _to Recipient of the NFT
      * @param _tokenUri URI for the token being minted
      * @param _creator Calling creator of the token.
      * @param _data If present, must include the token id in the parent contract (address of _to) to mint the token
      * @return tokenId The token ID of the token that was minted
     */
    function mint(
        address _to,
        bytes32 _tokenTypeName,
        string memory _tokenUri,
        uint256 _amount,
        address _creator,
        bytes memory _data
    ) external returns (uint256 tokenId) {
        // TODO minter role
        require(
            accessRestriction.isMinter(_msgSender()),
            "Must have minter role to mint."
        );

        // Check URI and creator
        _validateIncomingMint(
            _asSingletonStringArray(_tokenUri),
            _creator
        );

        // Check the token type and possible parent token before to save gas
        uint256 tokenTypeId = tokenTypeNameToId[_tokenTypeName];
        require(
            tokenTypeId > 0,
            "Token type does not exist"
        );

        tokenId = _generateTokenId(tokenTypeId, _tokenUri);

        // check recipient token IFF exists within this typed composable
        if (_to == address(this)) {
            _validateSelfComposability(tokenId, _data);
            // set approval for creator because the token is going to another token
            approveAtMint(_creator, tokenId);
        }

        // Check that the sender has the rights to create the token
        require(
            !_exists(tokenId) || _creator == tokenCreators[tokenId],
            "Only the creator of the token may mint more"
        );

        // call super minting method
        _mint(_to, tokenId, _amount, _data);

        if (!_exists(tokenId)) {
            // associate URI
            tokenUris[tokenId] = _tokenUri;
            //  associate creator
            tokenCreators[tokenId] = _creator;
        }

        // add to token id supply
        tokenSupply[tokenId] = tokenSupply[tokenId].add(_amount);
    }

    function mintBatch(
        address _to,
        bytes32 _tokenTypeName,
        string[] memory _tokenUris,
        uint256[] memory _amounts,
        address _creator,
        bytes memory _data
    ) external returns (uint256[] memory tokenIds) {
        // TODO minter role
        require(
            accessRestriction.isMinter(_msgSender()),
            "Must have minter role to mint."
        );

        // TODO do we really need amounts?
        require(
            _tokenUris.length == _amounts.length, 
            "Minting parameters length mismatch"
        );

        // Check URI and creator
        _validateIncomingMint(_tokenUris, _creator);

        // Check the token type and possible parent token before to save gas
        uint256 tokenTypeId = tokenTypeNameToId[_tokenTypeName];
        require(
            tokenTypeId > 0,
            "Token type does not exist"
        );

        bool selfComposing = _to == address(this);

        // check recipient token IFF exists within this typed composable
        if (selfComposing) {
            // we shift left because the type is the index, and so we only have to once
            _validateSelfComposability(tokenTypeId << TOKEN_TYPE_SHIFT, _data);
        }

        uint256 currentTokenId; // iterator
        tokenIds = new uint256[](_tokenUris.length);

        for (uint256 i; i < _tokenUris.length; ++i) {
            currentTokenId = _generateTokenId(tokenTypeId, _tokenUris[i]);
            
            // Check that the sender has the rights to create the token
            require(
                !_exists(currentTokenId) || _creator == tokenCreators[currentTokenId],
                "Only the creator of the token may mint more"
            );
            tokenIds[i] = currentTokenId;
        }

        if (selfComposing) {
            // set approval for creator because the token is going to another token
            approveAtBatchMint(_creator, tokenIds);
        }

        // call super minting method
        _mintBatch(_to, tokenIds, _amounts, _data);

        for (uint256 i; i < _tokenUris.length; ++i) {
            currentTokenId = tokenIds[i];
            if (!_exists(currentTokenId)) {
                // associate URI
                tokenUris[currentTokenId] = _tokenUris[i];
                //  associate creator
                tokenCreators[currentTokenId] = _creator;
            }

            // add to token id supply
            tokenSupply[currentTokenId] = tokenSupply[currentTokenId].add(_amounts[i]);
        }
    }

/*
function _validateBatchSelfComposability(uint256[] memory _tokenTypeIds) internal view {
        uint256 recipientTokenId = _loadRecipientTokenId();
        require(_exists(recipientTokenId));

        uint256 recipientTypeId = (recipientTokenId & TOKEN_TYPE_MASK) >> TOKEN_TYPE_SHIFT;

        uint256 recipientChildTypesBitmap = tokenTypes[recipientTypeId].childTypesBitmap;

        uint256 currentTokenTypeId;
        uint256 tokenTypeIdsBitmap;

        // create a bitmap of all the types passed in
        for (uint256 i; i < _tokenTypeIds.length; ++i) {
            currentTokenTypeId = (_tokenTypeIds[i] & TOKEN_TYPE_MASK) >> TOKEN_TYPE_SHIFT;
            tokenTypeIdsBitmap = tokenTypeIdsBitmap | (1 << currentTokenTypeId);
        }

        require(
            tokenTypeIdsBitmap & recipientChildTypesBitmap == recipientChildTypesBitmap,
            "Recipient token has not been authorized to one or more of these children."
        );
    }
*/
    function _validateSelfComposability(uint256 _tokenTypeId, bytes memory _data) internal view {
        require(
            _data.length == 32,
            "Data must contain parent token id if minting to contract."
        );
        uint256 recipientTokenId = _loadRecipientTokenId();

        require(
            _exists(recipientTokenId),
            "Recipient token does not exist"
        );

        require(
            this.isAuthorizedChildType(recipientTokenId, _tokenTypeId),
            "Recipient token has not been authorized to receive this child"
        );
    }

    function _generateTokenId(
        uint256 _tokenType, 
        string memory _tokenUri
    ) internal pure returns (uint256 tokenId) {
        // |--TokenType(16)--||--Unique hash of token URI (240)--|
        tokenId = _tokenType << TOKEN_TYPE_SHIFT | 
            uint256(keccak256(abi.encodePacked(_tokenUri, "SALTY_SALT"))) >> 256 - TOKEN_TYPE_SHIFT;
    }

    function _generateTokenIds(
        uint256 _tokenType,
        string[] memory _tokenUris
    ) internal pure returns (uint256[] memory tokenIds) {
        tokenIds = new uint256[](_tokenUris.length);

        uint256 tokenTypeShifted = _tokenType << TOKEN_TYPE_SHIFT;
        for (uint256 i; i < _tokenUris.length; ++i) {
            // |--TokenType(16)--||--Unique hash of token URI (240)--|
            tokenIds[i] = tokenTypeShifted | 
                uint256(keccak256(abi.encodePacked(_tokenUris[i], "SALTY_SALT"))) >> 256 - TOKEN_TYPE_SHIFT;
        }
    }

    /**
     * @dev onlyAdmin
     * TODO batch
     */
    function createTokenTypes(
        bytes32[] memory _tokenTypeNames
    ) external onlyAdmin returns (uint256[] memory tokenTypeIds) {
        // iterator
        bytes32 currentTokenTypeName;
        tokenTypeIds = new uint256[](_tokenTypeNames.length);

        for (uint256 i; i < _tokenTypeNames.length; ++i) {

            currentTokenTypeName = _tokenTypeNames[i];
            require(
                tokenTypeNameToId[currentTokenTypeName] == 0, // the type does not exist
                "Already a type"
            );

            // create the new Type
            TokenType memory newType = TokenType({
                tokenTypeName: currentTokenTypeName, 
                childTypesBitmap: 0
            });

            // we are using 1 based indexing because all indexes are initialized to zero... easy existence check
            tokenTypeCounter.increment();
            uint256 tokenTypeId = tokenTypeCounter.current();

            // avoid weird opcode errors... we shouldn't ever have this many anyway
            require(tokenTypeId < 256, "Too many types");

            tokenTypes[tokenTypeId] = newType;
            tokenTypeNameToId[currentTokenTypeName] = tokenTypeId;
            
            // add to return array
            tokenTypeIds[i] = tokenTypeId;
        }
        emit TokenTypesCreated(_tokenTypeNames, tokenTypeIds);

    }

    /** 
     * @dev can pass in type or token ids
     */
     function authorizeChildType(
         uint256 _parentType, 
         uint256 _childType
    ) external onlyAdmin {
        // shift right because shifted left on creation, now need index
        uint256 parentTypeId = (_parentType & TOKEN_TYPE_MASK) >> TOKEN_TYPE_SHIFT;
        uint256 childTypeId = (_childType & TOKEN_TYPE_MASK) >> TOKEN_TYPE_SHIFT;

        require(
            parentTypeId > 0 && childTypeId > 0,
            "Parent and child types must exist before being authorized"
        );

        // storage because we're modifying its value
        TokenType storage parentTokenType = tokenTypes[parentTypeId];

        // set the index of the child token type to 1 in the parent TokenType's child bitmap 
        parentTokenType.childTypesBitmap = parentTokenType.childTypesBitmap | (1 << childTypeId);
        
        emit ChildTypeAuthorized(parentTypeId, childTypeId);
    }

    /** 
     * @notice Returns a bool representing whether the _parentType is authorized to hald the _childType
     * @dev can pass in type or token ids
     * @param _parentType TokenID or TokenTypeId of the parent token
     * @param _parentType TokenID or TokenTypeId of the parent token
     */
    function isAuthorizedChildType(
        uint256 _parentType, 
        uint256 _childType
    ) external view returns (bool) {
        // shift right because shifted left on creation, now need index
        uint256 parentTypeId = (_parentType & TOKEN_TYPE_MASK) >> TOKEN_TYPE_SHIFT;
        uint256 childTypeId = (_childType & TOKEN_TYPE_MASK) >> TOKEN_TYPE_SHIFT;

        // console.log("parentTypeId: %s", parentTypeId);
        // console.log("childTypeId: %s", childTypeId);
        
        require(
            parentTypeId > 0 && childTypeId > 0,
            "Parent and child types must exist before checking authorization"
        );

        // if the bit at the child type's index is set to 1, then it has been authorized
        return (tokenTypes[parentTypeId].childTypesBitmap & (1 << childTypeId)) != 0;
    }

    /**
     * @notice Returns the uri for the given token id
     * @param _tokenId Token ID queried for its URI.
     */
    function uri(uint256 _tokenId) external view override returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");

        string memory tokenUri = tokenUris[_tokenId];

        if (bytes(tokenUris[_tokenId]).length > 0) {
            return string(abi.encodePacked(baseUri, tokenUri));
        }
        // If there is no tokenUri, concatenate the tokenID to the baseUri.
        return string(abi.encodePacked(baseUri, StringsUpgradeable.toString(_tokenId)));
    }

    function tokenType(
        uint256 _tokenId
    ) external view returns (uint256 tokenTypeId, bytes32 tokenTypeName) {
        tokenTypeId = (_tokenId & TOKEN_TYPE_MASK) >> TOKEN_TYPE_SHIFT;
        tokenTypeName = tokenTypes[tokenTypeId].tokenTypeName;
    }

    /**
     * @notice Gives balance of child given it's contract and id.
     * @dev Does not check for existence or authorization of child contract. Will return 0 either way.
     * @param _tokenId Token ID to query
     * @param _childContract Contract for child tokens
     * @param _childTokenId Child Token ID to query
     */
    function childBalance(
        uint256 _tokenId, 
        address _childContract, 
        uint256 _childTokenId
    ) override external view returns (uint256) {
        return parentToChildBalances[_tokenId][_childContract][_childTokenId];
    }

    /** 
     * @notice Returns an array of all the child token ids for the given token and child contract.
     * @dev Token must exist and the child contract must be authorized, otherwise will return an empty array
     * @param _tokenId Id of the token to query for children
     * @param _childContract address of the child contract for which the children are queried
     */
    function childTokensOf(
        uint256 _tokenId, 
        address _childContract
    ) override external view returns (uint256[] memory childTokens) {
        //  || !authorizedChildContracts.contains(_childContract)
        if (!_exists(_tokenId)) {
            return new uint256[](0);
        }

        childTokens = new uint256[](parentToChildTokens[_tokenId][_childContract].length());

        for (uint256 i; i < parentToChildTokens[_tokenId][_childContract].length(); ++i) {
            childTokens[i] = parentToChildTokens[_tokenId][_childContract].at(i);
        }
    }

    /** 
     * @notice Returns an array of all the parent token ids for the given token and child contract.
     * @dev Token must exist and the child contract must be authorized, otherwise will return an empty array
     * @param _childContract address of the child contract for which the parents are queried
     * @param _childTokenId Id of the token to query for parent
      */
    function parentTokensOf(
        address _childContract, 
        uint256 _childTokenId
    ) override external view returns (uint256[] memory parentTokens) {
        // if (!authorizedChildContracts.contains(_childContract)) {
        //     return new uint256[](0);
        // }

        parentTokens = new uint256[](childToParentHolders[_childContract][_childTokenId].length());

        for (uint256 i; i < childToParentHolders[_childContract][_childTokenId].length(); ++i) {
            parentTokens[i] = childToParentHolders[_childContract][_childTokenId].at(i);
        }
    }

    function isAuthorizedChildContract(address _childContract) public view returns (bool) {
        return authorizedChildContracts.contains(_childContract);
    }

    /**
     * @dev Transfers child token from a token ID.
     * This method would be called to remove a child from a token and tranfer it to a new owner.
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
    ) public override _onlyApproved(_fromTokenId) cachedInternalTransfer(_data) {
        require(_to != address(0), "Transfer to the zero address");
        require(_amount > 0, "Must transfer more than one token");
        // TODO verify child approvals????

        console.log("safeTransferChildFrom before: %s", pendingInternalRecipientId);

        // TODO this should fire an event for internal transfers that's different... presumably using _data

        // _beforeChildTransfer(operator, _fromTokenId, _to, _childContract, _asSingletonUintArray(_childTokenId), _asSingletonUintArray(_amount), _data);

        // TODO check for locked or first sale
        _removeChild(_fromTokenId, _childContract, _childTokenId, _amount);

        // TODO - ensure that the _to != this... 
        // call safeBatchTransferFrom on the child contract to transfer the tokens from this to _to
        // TODO this should check to ensure that this call is possible... ie all authorizedchildcontracts need to be compatible with this
        ERC1155Upgradeable(_childContract).safeTransferFrom(address(this), _to, _childTokenId, _amount, _data);
        console.log("safeTransferChildFrom after: %s", pendingInternalRecipientId);

        emit TransferChildToken(_fromTokenId, _to, _childContract, _childTokenId, _amount);
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
    ) public override _onlyApproved(_fromTokenId) cachedInternalTransfer(_data) {
        require(_childTokenIds.length == _amounts.length, "_childTokenIds and _amounts length mismatch");
        require(_to != address(0), "Transfer to the zero address");

        // _beforeChildTransfer(operator, _fromTokenId, _to, _childContract, _childTokenIds, _amounts, _data);

        // loop through the 
        for (uint256 i; i < _childTokenIds.length; ++i) {
            uint256 childTokenId = _childTokenIds[i];
            uint256 amount = _amounts[i];

            _removeChild(_fromTokenId, _childContract, childTokenId, amount);
        }
        // call safeBatchTransferFrom on the child contract to transfer the tokens from this to _to
        ERC1155Upgradeable(_childContract).safeBatchTransferFrom(address(this), _to, _childTokenIds, _amounts, _data);
        emit TransferChildTokenBatch(_fromTokenId, _to, _childContract, _childTokenIds, _amounts);
    }

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
    ) virtual external override returns (bytes4) {
        // check that the _data can support the recipient token ID
        require(_data.length == 32, "ERC998: data must contain the unique uint256 tokenId to transfer the child token to");

        uint256 _recipientTokenId = _loadRecipientTokenId();
        _validateRecipientToken(_recipientTokenId, _operator, _from);

        _receiveChild(_recipientTokenId, _msgSender(), _childTokenId, _amount);

        emit ReceivedChildToken(_from, _recipientTokenId, _msgSender(), _childTokenId, _amount);

        // TODO possibly limit number of tokens for children?

        return this.onERC1155Received.selector;
    }

    /**
      * @notice Batch ERC1155 receiver callback hook, used to enforce child 
      *         token bindings to a given parent token ID
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
        _validateRecipientToken(_recipientTokenId, _operator, _from);

        // Gas heavy...
        for (uint256 i; i < _childTokenIds.length; ++i) {
            _receiveChild(_recipientTokenId, _msgSender(), _childTokenIds[i], _amounts[i]);
        }

        emit ReceivedChildTokenBatch(_from, _recipientTokenId, _msgSender(), _childTokenIds, _amounts);

        return this.onERC1155BatchReceived.selector;
    }

    /**
     * @dev Takes the msg.data and extracts the embedded recipient token's ID.
     */
    function _loadRecipientTokenId() internal pure returns (uint256 _recipientTokenId) {
        uint256 _index = msg.data.length - 32;
        assembly {_recipientTokenId := calldataload(_index)}
    }

    /**
     * @notice Checks that the URI is not empty and the artist is not the zero address
     * @param _tokenUris URIs supplied on minting
     * @param _creator Address supplied on minting for creator
     */
    function _validateIncomingMint(
        string[] memory _tokenUris, 
        address _creator
    ) pure private {
        require(_creator != address(0), "Creator is zero address.");
        for (uint256 i; i < _tokenUris.length; ++i) {
            require(bytes(_tokenUris[i]).length != 0, "Token URI is empty.");
        }
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
    function _validateRecipientToken(
        uint256 _recipientTokenId, 
        address _operator, 
        address _from
    ) internal view {
        require(_exists(_recipientTokenId), "Recipient token does not exist.");

        // Require prior authorization to accept tokens
        require(
            authorizedChildContracts.contains(_msgSender())
                || _msgSender() == address(this), // can transfer tokens within self
            "This contract has not been authorized to receive this token"
        );

        // Sender must be creator OR newly minted
        if (_from != address(0)) {
            require(
                tokenCreators[_recipientTokenId] == _from
                    || pendingInternalRecipientId == _recipientTokenId, // allow for verified internal transfers
                "Only the owner of the parent token may add aditional child tokens."
            );

            // Ensure approved addresses cannot transfer child tokens.
            // however, base approvals should be able to... ex: orchestrator
            require(_operator == _from || isApprovedForAll(_from, _operator), "Operator is not owner");
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
    function _receiveChild(
        uint256 _tokenId, 
        address _childContract, 
        uint256 _childTokenId, 
        uint256 _amount
    ) private {
        require(_amount > 0, "Must be receiving at least one child token.");

        // check that the parent is allowed to receive the child if it is a self transfer
        if (_childContract == address(this)) {
            require(
                this.isAuthorizedChildType(_tokenId, _childTokenId),
                "The parent token is not authorized to hold the child token"
            );
        }

        // Add the child token to the parent token's balance
        uint256 finalBalance = parentToChildBalances[_tokenId][_childContract][_childTokenId] = 
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
    function _removeChild(
        uint256 _tokenId,
        address _childContract,
        uint256 _childTokenId,
        uint256 _amount
    ) private {
        require(
            _amount != 0 || parentToChildBalances[_tokenId][_childContract][_childTokenId] >= _amount, 
            "ERC998: insufficient child balance for transfer"
        );

        uint256 finalBalance = parentToChildBalances[_tokenId][_childContract][_childTokenId] = 
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
     * @notice Adds an address to the authorizedChildContracts that can be held by this contract.
     * TODO there should be a paired deauthorize, but this leads to complications if there are already attached tokens.
     * @dev Checks for the _INTERFACE_ID_ERC1155 interface ID.
     * @param _childContract address to be authorized
     */
    function authorizeChildContract(address _childContract) external onlyAdmin {
        require(
            IERC1155Upgradeable(_childContract).supportsInterface(0xd9b67a26),
            "authorizeChildContract: only ERC1155 contracts may be authorized."
        );
        authorizedChildContracts.add(_childContract);

        // TODO create type for the child contract to add to the authorized types?
        // this shouldn't be necessary because if the token does not match any of the type 
        // masks then it's obviously  from somewhere else?
        // bytes32(uint256(uint160(_childContract))))
    }

    function setBaseUri(string calldata _baseUri) external onlyAdmin {
        _setBaseUri(_baseUri);
        emit BaseUriUpdated(_baseUri);
    }

    /**
     * @dev Sets the base URI for this contract.
     */
    function _setBaseUri(string memory _baseUri) internal {
        baseUri = _baseUri;
    }

    /**
     * @notice Sets the name of the token represented by this contract.
     * @dev Only admin
     * @param _name New name for all tokens represented by this contract.
     */
     function setName(string calldata _name) external onlyAdmin {
        _setName(_name);
        emit TokenNameUpdated(_name);
    }

    /**
     * @dev Sets the name of the token represented by this contract.
     * @param _name New name for all tokens represented by this contract.
     */
    function _setName(string memory _name) internal {
        name = _name;
    }

    /**
     * @notice Updates the URI of a token represented by this contract.
     * @dev Only admin
     * @param _tokenId The ID of the token being updated
     * @param _tokenUri The new URI
     */
    function updateTokenUri(uint256 _tokenId, string memory _tokenUri) external onlyAdmin {
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

    /**
     * @dev Returns whether the specified token exists by checking to see if it has a creator
     * @param _id uint256 ID of the token to query the existence of
     * @return bool whether the token exists
     */
    function _exists(uint256 _id) internal view returns (bool) {
        return tokenSupply[_id] != 0;
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
    */
    function _beforeChildTransfer(
        address _operator,
        uint256 _fromTokenId,
        address _to,
        address _childContract,
        uint256[] memory _ids,
        uint256[] memory _amounts,
        bytes memory _data
    )
        internal virtual
    { }

    function _beforeTokenTransfer(
        address _operator,
        address _from,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _amounts,
        bytes memory _data
    )
        internal
        virtual
        override
    { 
        // from == 0 address implies a mint
        // if _to == 0, implies burn and so transfer approval to burn address should be fine... TODO should probably nuke approvals
        if (!_to.isContract()) {
            uint256 idCount = _ids.length;
            
            if (_from == address(0)) {
                // this is a mint because address is zero
                idCount == 1 ? approveAtMint(_to, _ids[0]) : approveAtBatchMint(_to, _ids);
            } else {
                // this is a between user transfer OR BURN TODO
                for (uint256 i; i < idCount; ++i) {
                    transferApproval(_from, _to, _ids[i]);
                }
            }
        }
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 _interfaceId
    ) 
        public 
        view 
        override(ERC165Upgradeable, IERC165Upgradeable) 
        returns (bool)
    {
        return _interfaceId == _INTERFACE_ID_ERC1155COMPOSABLE || super.supportsInterface(_interfaceId);
    }

    function _asSingletonUintArray(uint256 element) private pure returns (uint256[] memory) {
        uint256[] memory array = new uint256[](1);
        array[0] = element;

        return array;
    }

    function _asSingletonStringArray(string memory element) private pure returns (string[] memory) {
        string[] memory array = new string[](1);
        array[0] = element;

        return array;
    }
}
