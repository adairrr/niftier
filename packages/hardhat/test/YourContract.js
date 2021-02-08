const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  beforeEach(async function () {
    YourContract = await ethers.getContractFactory("YourContract");
    yourContract = await YourContract.deploy();
    await yourContract.deployed();
  });
 
  // Test case
  it('retrieve returns a value previously stored', async function () {
    // Store a value
    await yourContract.setPurpose("New purpose");
 
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await yourContract.getPurpose()).toString()).to.equal("New purpose");
  });
});
