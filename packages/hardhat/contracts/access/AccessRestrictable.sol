// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "./AccessRestriction.sol";

/**
 * @notice Abstract wrapper class for AccessRestriction so that functions can be reused.
 */
abstract contract AccessRestrictable is Initializable, ContextUpgradeable {

    function __AccessRestrictable_init(AccessRestriction _accessRestriction) internal initializer {
        __Context_init_unchained();
        __AccessRestrictable_init_unchained(_accessRestriction);
    }

    function __AccessRestrictable_init_unchained(AccessRestriction _accessRestriction) internal initializer {
        _setAccessRestriction(_accessRestriction);
    }

    event AccessRestrictionUpdated(AccessRestriction _accessRestriction);

    /// @dev governs access control
    AccessRestriction public accessRestriction;

    /** 
     * @notice modifier to restrict function calls to admins.
     */
    modifier onlyAdmin() {
        require(
            accessRestriction.isAdmin(_msgSender()),
            "AccessRestrictable.onlyAdmin: Sender must have admin role."
        );
        _;
    }

    /**
     * @notice Update the access restriction for new deploments or other.
     * @dev onlyAdmin
     * @param _accessRestriction new AccessRestriction address
     */
    function updateAccessRestriction(AccessRestriction _accessRestriction) external onlyAdmin {
        _setAccessRestriction(_accessRestriction);
        emit AccessRestrictionUpdated(_accessRestriction);
    }

    function _setAccessRestriction(AccessRestriction _accessRestriction) internal {
        // test to ensure correct instance
        AccessRestriction candidateContract = AccessRestriction(_accessRestriction);
        require(candidateContract.isAccessRestriction());

        accessRestriction = _accessRestriction;
    }
}
