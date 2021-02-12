
// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/GSN/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableMapUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "./TokenTypeUpgradeable.sol";
import "../access/IAccessRestriction.sol";

/**
 * @dev {ERC1155} token, including:
 *
 *  - ability for holders to burn (destroy) their tokens
 *  - a minter role that allows for token minting (creation)
 *  - a pauser role that allows to stop all token transfers
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to other accounts.
 */
contract LayerUpgradeable is Initializable, ContextUpgradeable, AccessControlUpgradeable, TokenTypeUpgradeable, ERC1155PausableUpgradeable {
    
    using AddressUpgradeable for address;
    using SafeMathUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;
    using EnumerableMapUpgradeable for EnumerableMapUpgradeable.UintToAddressMap;

    function initialize(string memory _uri, address _accessControlAddress) public virtual initializer {
        __LayerUpgradeable_init(_uri, _accessControlAddress);
    }

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    bytes32 public constant IMAGE_TYPE = keccak256("IMAGE_TYPE");
    bytes32 public constant VIDEO_TYPE = keccak256("VIDEO_TYPE");
    bytes32 public constant AUDIO_TYPE = keccak256("AUDIO_TYPE");
    bytes32 public constant THREE_D_TYPE = keccak256("THREE_D_TYPE");
    bytes32 public constant VR_TYPE = keccak256("VR_TYPE");

    IAccessRestriction public AccessRestriction;

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, and `PAUSER_ROLE` to the account that
     * deploys the contract.
     */
    function __LayerUpgradeable_init(string memory _uri, address _accessControlAddress) internal initializer {
        __Context_init_unchained();
        __AccessControl_init_unchained();
        __TokenType_init_unchained(_msgSender());
        __ERC165_init_unchained();
        __ERC1155_init_unchained(_uri);
        __Pausable_init_unchained();
        __ERC1155Pausable_init_unchained();
        __LayerUpgradeable_init_unchained(_uri, _accessControlAddress);
    }

    function __LayerUpgradeable_init_unchained(string memory _baseUri, address _accessControlAddress) internal initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        baseUri = _baseUri;
        _setupType()

        // setup access
        IAccessRestriction candidateContract = IAccessRestriction(_accessControlAddress);
        require(candidateContract.isAccessRestriction());
        AccessRestriction = candidateContract;
    }

    CountersUpgradeable.Counter private _tokenIdTracker;

    event LayerCreated(uint256 indexed layerId);

    // Mapping from holder address to their (enumerable) set of owned tokens
    mapping (address => EnumerableSetUpgradeable.UintSet) private holderTokens;

    // Enumerable mapping from token ids to their owners
    EnumerableMapUpgradeable.UintToAddressMap private tokenOwners;

    // Mapping from token ID to approved address
    mapping (uint256 => address) private tokenApprovals;

    // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) private operatorApprovals;

    // mapping for token URIs
    mapping (uint256 => bytes32) private tokenUris;

    // Base URI
    string private baseUri;

    function createLayer(bytes32 calldata _uri, bytes32 _layerType) external returns (uint256) {
        // TODO access controls
        require(bytes(_uri).length > 0, "LayerUpgradeable.createLayer: URI is a blank string");

        uint256 layerId = _tokenIdTracker.current();
        _setTokenURI(layerId, _uri);
        associateType(_layerType, layerId);

        emit LayerCreated(layerId);

        _tokenIdTracker.increment();
    }

    function batchCreateLayers(bytes32[] calldata _uris) external returns (uint256[] memory layerIds) {
        // TODO access controls

        require(_uris.length > 0, "LayerUpgradeable.batchCreateLayers: No data supplied in array");

        layerIds = new uint256[](_uris.length);
        for(uint i = 0; i < _uris.length; i++) {
            bytes32 currentUri = _uris[i];
            require(currentUri.length > 0, "LayerUpgradeable.batchCreateLayers: URI is a blank string");

            uint256 layerId = _tokenIdTracker.current();

            _setTokenURI(layerId, currentUri);

            layerIds[i] = layerId;

            emit LayerCreated(layerId);
        }
        return layerIds;
    }

    /**
     * @dev Creates `amount` new tokens for `to`, of token type `id`.
     *
     * See {ERC1155-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the `MINTER_ROLE`.
     */
    function mintLayer(address _to, uint256 _layerId, uint256 _amount, bytes calldata _data) external {
        require(hasRole(MINTER_ROLE, _msgSender()), "LayerUpgradeable: must have minter role _to mint");

        require(tokenUris[_layerId].length > 0, "LayerUpgradeable.mintLayer: Layer does not exist");
        require(_amount > 0, "LayerUpgradeable.mintLayer: No amount specified");

        strandTotalSupply[_strandId] = strandTotalSupply[_strandId].add(_amount);

        _mint(_to, _layerId, _amount, _data);
    }

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] variant of {mint}.
     */
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public virtual {
        require(hasRole(MINTER_ROLE, _msgSender()), "LayerUpgradeable: must have minter role to mint");

        _mintBatch(to, ids, amounts, data);
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 _tokenId) internal view virtual returns (bool) {
        return tokenOwners.contains(_tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal virtual {
        require(_exists(_tokenId), "URI set attempt for nonexistent token");
        tokenUris[_tokenId] = _tokenURI;
    }

    function uri(uint256 _tokenId) external view override returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");

        string memory tokenURI = tokenUris[_tokenId];

        if (bytes(tokenURI).length > 0) {
            return string(abi.encodePacked(baseUri, tokenURI));
        }
        // If there is no tokenURI, concatenate the tokenID to the baseUri.
        return string(abi.encodePacked(baseUri, StringsUpgradeable.toString(_tokenId)));
    }

    /**
     * @dev Pauses all token transfers.
     *
     * See {ERC1155Pausable} and {Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public virtual {
        require(hasRole(PAUSER_ROLE, _msgSender()), "LayerUpgradeable: must have pauser role to pause");
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     *
     * See {ERC1155Pausable} and {Pausable-_unpause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public virtual {
        require(hasRole(PAUSER_ROLE, _msgSender()), "LayerUpgradeable: must have pauser role to unpause");
        _unpause();
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
        internal virtual override(ERC1155Upgradeable, ERC1155PausableUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    uint256[50] private __gap;
}
