const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("YourContract (proxy)", function () {
  beforeEach(async function () {
    YourContract = await ethers.getContractFactory("YourContract");
    yourContract = await upgrades.deployProxy(YourContract, ["New purpose"]);
  });
 
  // Test case
  it('retrieve returns a value previously initialized', async function () {
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await yourContract.getPurpose()).toString()).to.equal("New purpose");
  });
});
