// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/**
 * @notice 
 */
contract AccessRestriction is AccessControlUpgradeable {
    // -------------------------------------------------------
    // Role definitions
    bytes32 public constant ARTIST_ROLE = keccak256("ARTIST_ROLE");
    bytes32 public constant ARTPIECE_FACTORY_ROLE = keccak256("ARTPIECE_FACTORY_ROLE");
    bytes32 public constant LAYER_FACTORY_ROLE = keccak256("LAYER_FACTORY_ROLE");
    // bytes32 public constant LAYER_FACTORY_ROLE = keccak256("LAYER_FACTORY_ROLE");
    // bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @dev sanity check to ensure that the correct contract is pointed to
     */
    bool public isAccessRestriction;

    function __AccessRestriction_init(address _deployer) public initializer {
        AccessControlUpgradeable.__AccessControl_init();

        isAccessRestriction = true; 

        if (hasRole(DEFAULT_ADMIN_ROLE, _deployer) == false) {
            _setupRole(DEFAULT_ADMIN_ROLE, _deployer);
        }
    }

    // -------------------------------------------------------
    // Role definitions

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "Caller is not admin");
        _;
    }

    modifier onlyArtpieceFactory() {
        require(isArtpieceFactory(msg.sender), "Caller is not artpiece factory");
        _;
    }

    modifier onlyLayerFactory() {
        require(isLayerFactory(msg.sender), "Caller is not layer factory");
        _;
    }

    /**
     * @notice Check if the address is an admin
     * @param _address contract/EOA to check
     * @return bool True if admin, False if not admin
     * should this be a modifier? 
     */
    function isAdmin(address _address) public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, _address);
    }

    function isArtpieceFactory(address _address) public view returns (bool) {
        return hasRole(ARTPIECE_FACTORY_ROLE, _address);
    }
    
    function isLayerFactory(address _address) public view returns (bool) {
        return hasRole(LAYER_FACTORY_ROLE, _address);
    }

    // -------------------------------------------------------
    // Setters
    function batchSetRoles(
        bytes32 roleType,
        address[] calldata addresses,
        bool[] calldata setTo
    )
        external onlyAdmin 
    {
        _batchSetRoles(roleType, addresses, setTo);
    }

    function _batchSetRoles(
        bytes32 roleType,
        address[] calldata addresses,
        bool[] calldata setTo
    ) 
        private 
    {
        require(addresses.length == setTo.length, "addresses length and setTo length must be equal");

        for (uint256 i = 0; i < addresses.length; i++) {
            //require(addresses[i].isContract(), "Role address need contract only");
            if (setTo[i]) {
                grantRole(roleType, addresses[i]);
            } else {
                revokeRole(roleType, addresses[i]);
            }
        }
    }

    // Reserved storage space to allow for layout changes in the future.
    uint256[50] private __gap;
}
