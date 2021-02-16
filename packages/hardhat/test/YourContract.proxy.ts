import { ethers, upgrades } from 'hardhat'
import { use, expect } from 'chai';
import { YourContract } from "../typechain";

import { solidity } from "ethereum-waffle";

use(solidity);

describe("YourContract (proxy)", function () {
  let YourContract;
  let yourContract: YourContract;

  beforeEach(async function () {
    YourContract = await ethers.getContractFactory("YourContract");

    yourContract = await upgrades.deployProxy(YourContract, ["New purpose"]) as YourContract;
    await yourContract.deployed();
  });
 
  // Test case
  it('retrieve returns a value previously initialized', async function () {
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await yourContract.getPurpose()).toString()).to.equal("New purpose");
  });
});
