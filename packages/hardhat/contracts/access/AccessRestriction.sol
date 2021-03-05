// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/**
 * @notice Oversees access control. 
 * @dev You may pass this contract's address into the constructor of your contracts. 
 * Ex (in initializer): 
   AccessRestriction accessRestriction;
   // check for valid compatibility
   AccessRestriction candidateContract = AccessRestriction(_accessControlAddress);
       require(candidateContract.isAccessRestriction());
       accessRestriction = candidateContract;
 */
contract AccessRestriction is AccessControlUpgradeable {

    bytes32 public constant ARTIST_ROLE = keccak256("ARTIST_ROLE");
    bytes32 public constant ORCHESTRATOR_ROLE = keccak256("ORCHESTRATOR_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


    /// @dev sanity check to ensure that the correct contract is pointed to
    bool public isAccessRestriction;

    function initialize(address _deployer) public initializer {
        AccessControlUpgradeable.__AccessControl_init();

        isAccessRestriction = true; 

        if (hasRole(DEFAULT_ADMIN_ROLE, _deployer) == false) {
            _setupRole(DEFAULT_ADMIN_ROLE, _deployer);
            _setupRole(MINTER_ROLE, _deployer);
        }
    }

    // ----------------------------------------------------------------------------
    // modifiers
    // ----------------------------------------------------------------------------

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "Caller is not admin");
        _;
    }

    modifier onlyOrchestrator() {
        require(isOrchestrator(msg.sender), "Caller is not orchestrator");
        _;
    }

    // ----------------------------------------------------------------------------
    // functions
    // ----------------------------------------------------------------------------

    /**
     * @notice Check if the address is an admin
     * @param _address contract/EOA to check
     * @return bool True if admin, False if not admin
     */
    function isAdmin(address _address) public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, _address);
    }

    function isMinter(address _address) public view returns (bool) {
        return hasRole(MINTER_ROLE, _address);
    }

    function isOrchestrator(address _address) public view returns (bool) {
        return hasRole(ORCHESTRATOR_ROLE, _address);
    }

    /**
     * @notice Assigns _address to the minter role.
     * @dev onlyAdmin
     */
    function addMinter(address _address) external {
        grantRole(MINTER_ROLE, _address);
    }

    function addOrchestrator(address _address) external {
        grantRole(ORCHESTRATOR_ROLE, _address);
    }

    // Reserved storage space to allow for layout changes in the future.
    uint256[50] private __gap;
}
