import { ethers, upgrades } from "hardhat";
import { use, expect } from 'chai';
import { AccessRestriction } from "../../typechain";
import { ContractFactory } from "ethers";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

use(solidity);

describe("AccessRestriction", () => {

    let accessRestriction: AccessRestriction;
    let deployer: SignerWithAddress;
    let accounts: SignerWithAddress[];

    beforeEach(async () => {
        // get array of signers
        [deployer, ...accounts] = await ethers.getSigners();

        const AccessRestriction: ContractFactory = await ethers.getContractFactory("AccessRestriction");
        // accessRestriction = await AccessRestriction.deploy();
        // await accessRestriction.deployed();
        accessRestriction = await upgrades.deployProxy(
            AccessRestriction,
            [deployer.address],
            {unsafeAllowCustomTypes: true}
        ) as AccessRestriction;
    });
    
    // Test case
    it('should grant default admin role to deployer', async () => {
        // DEFAULT_ADMIN_ROLE == ZERO_BYTES32
        expect(await accessRestriction.getRoleMemberCount(ethers.constants.HashZero)).to.equal(1);
        expect(await accessRestriction.isAdmin(deployer.address)).to.equal(true);
    });
});
