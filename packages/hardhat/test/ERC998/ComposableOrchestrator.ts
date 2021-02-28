// import { ethers, upgrades } from "hardhat";
// import { BigNumber, constants, utils, Contract, ContractFactory } from "ethers";
// import { use, expect } from 'chai';
// import { AccessRestriction, TypedERC1155Composable, ComposableOrchestrator } from "../../typechain";
// import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
// import * as testUtils from './ERC1155ComposableShared';

// import { solidity } from "ethereum-waffle";

// use(solidity);

// describe("ComposableOrchestrator", async () => {

//   // contract instances
//   let accessRestriction: AccessRestriction;
//   let composableToken: TypedERC1155Composable;
//   let orchestrator: ComposableOrchestrator;

//   // signers
//   let deployer: SignerWithAddress;
//   let minter: SignerWithAddress;
//   let creator: SignerWithAddress;
//   let randomSigner: SignerWithAddress;
//   let accounts: SignerWithAddress[];

//   // constants
//   const BASE_URI = "BASE_URI";
//   const TOKEN_NAME = "TEST_COMPOSABLE";
//   const TOKEN_URI = "TOKEN_URI";
//   const ARTPIECE_TYPE = utils.formatBytes32String("ARTPIECE_TYPE");
//   const LAYER_TYPE = utils.formatBytes32String("LAYER_TYPE");

//   let AccessRestriction: ContractFactory;
//   let TypedERC1155Composable: ContractFactory;
//   let ComposableOrchestrator: ContractFactory;

//   beforeEach(async () => {
//     // get contract factories
//     AccessRestriction = await ethers.getContractFactory("AccessRestriction");
//     TypedERC1155Composable = await ethers.getContractFactory("TypedERC1155Composable");
//     ComposableOrchestrator = await ethers.getContractFactory("ComposableOrchestrator");

//     // get array of signers
//     [deployer, minter, creator, randomSigner, ...accounts] = await ethers.getSigners();

//     // deploy accessRestriction
//     accessRestriction = await upgrades.deployProxy(
//       AccessRestriction,
//       [deployer.address],
//       {unsafeAllowCustomTypes: true}
//     ) as AccessRestriction;

//     // add minter role to minter
//     await accessRestriction.addMinter(minter.address);

//     // deploy erc1155Composable
//     composableToken = await upgrades.deployProxy(
//       TypedERC1155Composable,
//       [accessRestriction.address, TOKEN_NAME, BASE_URI],
//       {unsafeAllowCustomTypes: true}
//     ) as TypedERC1155Composable;

//     // add a single artpiece type
//     await composableToken.createTokenType(ARTPIECE_TYPE);

//     // deploy composableOrchestrator
//     orchestrator = await upgrades.deployProxy(
//       TypedERC1155Composable,
//       [accessRestriction.address, composableToken.address],
//       {unsafeAllowCustomTypes: true}
//     ) as ComposableOrchestrator;
//   });

// });
