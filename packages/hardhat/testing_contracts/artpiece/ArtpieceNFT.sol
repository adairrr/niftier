// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";
import "../access/IAccessRestriction.sol";
import "../ERC998/ERC998ERC1155TopDown.sol";

contract ArtpieceNFT is ERC721Upgradeable, ERC1155ReceiverUpgradeable, ERC998ERC1155TopDown {

    using CountersUpgradeable for CountersUpgradeable.Counter;
    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address;

    // bytes32[] public constant DEFAULT_PRIMARY_TYPES = ["ARTPIECE_TYPE", "LAYER_TYPE", "CONTROLLER_TYPE"];

    CountersUpgradeable.Counter private _tokenIdTracker;
    
    /// @dev governs access control
    IAccessRestriction accessControl;

    // mapping from the address of the art/layer/controller to the creator
    mapping(uint256 => address) public artpieceToArtist;
    // mapping (uint256 => address) owners;
    // mapping(uint256 => bytes32) public ipfsHashes;
    // mapping(uint256 => string) public ipfsHashes;

    
    /**
     * @param _accessControlAddress address for the access controls
     * @param _baseURI
     */
    function initialize(
        address _accessControlAddress,
        string calldata _baseURI
    ) public initializer {
        __ERC721_init("Artpiece", "ART");
        _setBaseURI(_baseURI);

        IAccessRestriction candidateContract =
            IAccessRestriction(_accessControlAddress);
        require(candidateContract.isAccessRestriction());
        accessControl = candidateContract;
    }

    // function currentTokenId() public view returns (uint256) {
    //     return _tokenIdTracker.current();
    // }

    // function increaseTokenId() internal {
    //     _tokenIdTracker.increment();
    // }

    /**
     @notice Mints an Artpiece AND when minting to a contract checks if the beneficiary is a 721 compatible
     @dev Only senders with either the minter or smart contract role can invoke this method
     @param _to Recipient
     @param _artpieceUri URI of the artpiece being minted
     @param _artist address for the artist of the artpiece
     @return uint256 The token ID of the artpiece that was minted
     */
    function mint(address _to, string calldata _artpieceUri, address _artist) external returns (uint256) {
        assertValidMintingParams(_artpieceUri, _artist, 1);

        _tokenIdTracker.increment();
        uint256 artpieceId = _tokenIdTracker.current();
        _safeMint(_to, artpieceId);
        _setTokenURI(artpieceId, _artpieceUri);

        artpieceToArtist[artpieceId] = _artist;

        return artpieceId;
    }

    /**
     @notice Updates the artpiece URI of a given artpiece
     @param _artpieceId The ID of the artpiece being updated
     @param _artpieceUri The new URI
     */
    function setArtpieceUri(uint256 _artpieceId, string calldata _artpieceUri) external {
        require(accessControls.hasAdminRole(_msgSender()), "Artpiece.setArtpieceUri: Sender must have the admin role");
        _setTokenURI(_artpieceId, _artpieceUri);
    }

    /**
     * @notice Returns a list of Layers associated with the artpiece id.
     * @param _artpieceId id of the artpiece
     * @param _layerContract address of the layer contract
     */
    function getLayers(uint256 _artpieceId, address _layerContract) external view returns(uint256[] memory) {
        return childIdsForContract(_artpieceId, _layerContract);
    }

    function associateLayer(uint256 _artpieceId, address _layerContract, uint256 _layerId) {
        // check that the artpiece has not had first sale/ is not locked TODO
        require(artpieceToArtist[_artpieceId] == msg.sender, "Only the artist can associate layers to their art");
        // the layer associated must not be associated with another, unless that is the desire
        // the artist should be able to choose to mint another? 

    }

    /**
     * @notice Checks that the URI is not empty and the artist is not the zero address
     * @param _tokenUri URI supplied on minting
     * @param _artist Address supplied on minting
     */
    function assertValidMintingParams(string calldata _tokenUri, address _artist, uint8 _amount) pure private {
        require(bytes(_tokenUri).length > 0, "Artpiece.assertValidMintingParams: Token URI is empty");
        require(_artist != address(0), "Artpiece.assertValidMintingParams: Artist is zero address");
        require(_amount > 0, "Artpiece.assertValidMintingParams: Must have a mint amount greater than zero");
    }
}
