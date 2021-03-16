// import { ethers } from 'hardhat';
// import { BigNumber, constants, utils, Contract, ContractFactory } from 'ethers';
// import { use, expect } from 'chai';
// import { solidity } from 'ethereum-waffle';

// import { PriceConsumerV3 } from '../../typechain';

// use(solidity);


// describe('Price Consumer', async () => {

//   // contract instances
//   let priceConsumer: PriceConsumerV3;

//   let PriceConsumer: ContractFactory;

//   // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
//   // Default one below is ETH/USD contract on Kovan
//   const PRICE_FEED_CONTRACT = '0x9326BFA02ADD2366b30bacB125260Af641031331';

//   beforeEach(async () => {
//     // get contract factory
//     PriceConsumer = await ethers.getContractFactory('PriceConsumerV3');

//     priceConsumer = await PriceConsumer.deploy(PRICE_FEED_CONTRACT) as PriceConsumerV3;
//     await priceConsumer.deployed();
//   });


//   it('Price Feed should return a positive value', async function() {
//     this.timeout(0)

//     let result = await priceConsumer.getLatestPrice();
//     console.log('Price Feed Value: ', BigNumber.from(result._hex).toString());
//     expect(BigNumber.from(result._hex)).to.be.greaterThan(0)
//   });
// });
