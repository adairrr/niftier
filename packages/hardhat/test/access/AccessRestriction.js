const { ethers, upgrades } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("AccessRestriction", function () {

    let accessRestriction;
    let deployer;
    let accounts;

    beforeEach(async function () {
        // get array of signers
        [deployer, ...accounts] = await ethers.getSigners();

        const AccessRestriction = await ethers.getContractFactory("AccessRestriction");
        // accessRestriction = await AccessRestriction.deploy();
        // await accessRestriction.deployed();
        accessRestriction = await upgrades.deployProxy(
            AccessRestriction,
            [deployer.address],
            {unsafeAllowCustomTypes: true}
        );
    });
    
    // Test case
    it('should grant default admin role to deployer', async function () {
        // DEFAULT_ADMIN_ROLE == ZERO_BYTES32
        expect(await accessRestriction.getRoleMemberCount(ethers.constants.HashZero)).to.equal(1);
        expect(await accessRestriction.isAdmin(deployer.address)).to.equal(true);
    });
});
