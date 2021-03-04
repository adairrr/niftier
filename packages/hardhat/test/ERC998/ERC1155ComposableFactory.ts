import { BigNumber, constants, utils, ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";
import { use, expect } from 'chai';
import { AccessRestriction, ERC1155Composable, ERC1155ComposableFactory } from "../../typechain";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

import { solidity } from "ethereum-waffle";

use(solidity);

describe("ERC1155ComposableFactory", async function () {

  // contract instances
  let accessRestriction: AccessRestriction;
  let parentComposableToken: ERC1155Composable;
  let childComposableToken: ERC1155Composable;
  let composableTokenFactory: ERC1155ComposableFactory;
  let composableTokenFactoryAsUser: ERC1155ComposableFactory;

  // signers
  let deployer: SignerWithAddress;
  let minter: SignerWithAddress;
  let creator: SignerWithAddress;
  let randomSigner: SignerWithAddress;
  let accounts: SignerWithAddress[];

  // constants
  const BASE_URI = "BASE_URI";
  const TOKEN_NAME = "TEST_COMPOSABLE";
  const TOKEN_URI = "TOKEN_URI";
  const TOKEN_ONE_ID = BigNumber.from(0);
  const TOKEN_TWO_ID = BigNumber.from(1);

  const AccessRestriction: ContractFactory = await ethers.getContractFactory("AccessRestriction");
  const ERC1155Composable: ContractFactory = await ethers.getContractFactory("ERC1155Composable");
  const ERC1155ComposableFactory: ContractFactory = await ethers.getContractFactory("ERC1155ComposableFactory");

  [deployer, minter, creator, randomSigner, ...accounts] = await ethers.getSigners();

  beforeEach(async () => {
    // get array of signers
    // console.log(accounts);

    // deploy accessRestriction
    accessRestriction = await upgrades.deployProxy(
      AccessRestriction,
      [deployer.address],
      {unsafeAllowCustomTypes: true}
    ) as AccessRestriction;

    // add minter role to minter
    await accessRestriction.addMinter(minter.address);

    // deploy parent erc1155Composable
    parentComposableToken = await upgrades.deployProxy(
      ERC1155Composable,
      [accessRestriction.address, TOKEN_NAME, BASE_URI],
      {unsafeAllowCustomTypes: true}
    ) as ERC1155Composable;

    // deploy child erc1155Composable
    childComposableToken = await upgrades.deployProxy(
      ERC1155Composable,
      [accessRestriction.address, TOKEN_NAME, BASE_URI],
      {unsafeAllowCustomTypes: true}
    ) as ERC1155Composable;

    // deploy erc1155Composable factory
    composableTokenFactory = await upgrades.deployProxy(
      ERC1155ComposableFactory,
      [accessRestriction.address, parentComposableToken.address, childComposableToken.address],
      {unsafeAllowCustomTypes: true}
    ) as ERC1155ComposableFactory;

    // have an instance of this token with a random account as caller
    composableTokenFactoryAsUser = composableTokenFactory.connect(randomSigner);
  });

});
