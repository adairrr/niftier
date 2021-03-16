// import hre, { ethers } from 'hardhat';
// import { BigNumber, constants, utils, Contract, ContractFactory } from 'ethers';
// import { use, expect } from 'chai';
// import { solidity } from 'ethereum-waffle';

// import { APIConsumer } from '../../typechain';

// use(solidity);


// describe('Price Consumer', async () => {

//   // contract instances
//   let apiConsumer: APIConsumer;

//   let ApiConsumer: ContractFactory;

//   //LINK Token address set to Kovan address. Can get other values at https://docs.chain.link/docs/link-token-contracts
//   const LINK_TOKEN_ADDR = "0xa36085F69e2889c224210F603D836748e7dC0088";

//   beforeEach(async () => {
//     // get contract factory
//     ApiConsumer = await ethers.getContractFactory('APIConsumer');

//     apiConsumer = await ApiConsumer.deploy(LINK_TOKEN_ADDR) as APIConsumer;
//     await apiConsumer.deployed();
//   });


//   it("APIConsumer Should successfully make an external data request", async function() {
//     this.timeout(0)
    
//     //fund the contract
//     await hre.run("fund-link", {contract: apiConsumer.address});

//     //Now that contract is funded, we can cal the function to do the data request
//     await hre.run("request-data", {contract: apiConsumer.address});

//     //Read contract to see result of external data request
//     let result = await hre.run("read-data",{contract: apiConsumer.address});
//     console.log("Data: ",result);
//     expect(result).to.be.greaterThan(0);
//   });
// });
