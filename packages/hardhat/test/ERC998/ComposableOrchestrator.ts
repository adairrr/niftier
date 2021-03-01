import { ethers, upgrades } from "hardhat";
import { BigNumber, constants, utils, Contract, ContractFactory } from "ethers";
import { use, expect } from 'chai';
import { AccessRestriction, TypedERC1155Composable, ComposableOrchestrator } from "../../typechain";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import * as testUtils from './ERC1155ComposableShared';
import * as testConsts from './constants';

import { solidity } from "ethereum-waffle";

use(solidity);

describe("ComposableOrchestrator", async () => {

  // contract instances
  let accessRestriction: AccessRestriction;
  let composableToken: TypedERC1155Composable;
  let orchestrator: ComposableOrchestrator;

  // signers
  let deployer: SignerWithAddress;
  let minter: SignerWithAddress;
  let creator: SignerWithAddress;
  let randomSigner: SignerWithAddress;
  let accounts: SignerWithAddress[];

  let AccessRestriction: ContractFactory;
  let TypedERC1155Composable: ContractFactory;
  let ComposableOrchestrator: ContractFactory;

  beforeEach(async () => {
    // get contract factories
    AccessRestriction = await ethers.getContractFactory("AccessRestriction");
    TypedERC1155Composable = await ethers.getContractFactory("TypedERC1155Composable");
    ComposableOrchestrator = await ethers.getContractFactory("ComposableOrchestrator");

    // get array of signers
    [deployer, minter, creator, randomSigner, ...accounts] = await ethers.getSigners();

    // deploy accessRestriction
    accessRestriction = await upgrades.deployProxy(
      AccessRestriction,
      [deployer.address],
      {unsafeAllowCustomTypes: true}
    ) as AccessRestriction;

    // add minter role to minter
    await accessRestriction.addMinter(minter.address);

    // deploy erc1155Composable
    composableToken = await upgrades.deployProxy(
      TypedERC1155Composable,
      [accessRestriction.address, testConsts.TOKEN_NAME, testConsts.BASE_URI],
      {unsafeAllowCustomTypes: true}
    ) as TypedERC1155Composable;

    let tokenTypes = await testUtils.createTokenTypesAndGetIds(
      composableToken, 
      [testConsts.ARTPIECE_TYPE, 
        testConsts.LAYER_TYPE]
    );

    // authorize artpiece to hold layer type
    await composableToken.authorizeChildType(tokenTypes[0].shl(250), tokenTypes[1].shl(250));

    // deploy composableOrchestrator
    orchestrator = await upgrades.deployProxy(
      ComposableOrchestrator,
      [accessRestriction.address, composableToken.address],
      {unsafeAllowCustomTypes: true}
    ) as ComposableOrchestrator;

    // TODO add orchestrator role
    await accessRestriction.addMinter(orchestrator.address);
  });

  describe('mintChildrenAndParent', async () => {
    it('should mint a parent token and child tokens to it, when child type is authorized', async () => {
      // create arrays for 5 layers
      let childTokenCount = 5;
      let childTokenUris = new Array<string>();
      let childTokenAmounts = new Array<number>();
      for (let i = 0; i < childTokenCount; i++) {
        childTokenUris.push(testConsts.TOKEN_URI + i);
        childTokenAmounts.push(1);
      }

      let parentChildTx = await orchestrator.mintChildrenAndParent(
        testConsts.ARTPIECE_TYPE,
        testConsts.TOKEN_URI,
        testConsts.LAYER_TYPE,
        childTokenUris,
        childTokenAmounts,
        creator.address
      );

      let parentTokenId = await testUtils.getTokenIdFromMint(parentChildTx);

      let childTokenIds = await composableToken.childTokensOf(parentTokenId, composableToken.address);

      // we know that the minting methods already work!
      expect(childTokenIds).to.have.lengthOf(childTokenCount);

      // check that the parent of each of the child tokens is the correct parent token
      for (let i = 0; i < childTokenCount; i++) {
        let parentTokens = await composableToken.parentTokensOf(
          composableToken.address, 
          childTokenIds[i]
        );
        // check singular member, and that that singular member is the correct parent
        expect(parentTokens).to.have.lengthOf(1);
        expect(parentTokens[0]).to.equal(parentTokenId);
      }
    });

    it('should throw when the parent type does not exist', async () => {
      await expect(orchestrator.mintChildrenAndParent(
        utils.formatBytes32String("FAKE_TYPE"),
        testConsts.TOKEN_URI,
        testConsts.ARTPIECE_TYPE,
        [testConsts.TOKEN_URI],
        [1],
        creator.address
      )).to.be.revertedWith("Token type does not exist");
    });

    it('should throw when the child type does not exist', async () => {
      await expect(orchestrator.mintChildrenAndParent(
        testConsts.ARTPIECE_TYPE,
        testConsts.TOKEN_URI,
        utils.formatBytes32String("FAKE_TYPE"),
        [testConsts.TOKEN_URI],
        [1],
        creator.address
      )).to.be.revertedWith("Token type does not exist");
    });

    it('should throw when the child type is not authorized', async () => {
      let unauthorizedType = utils.formatBytes32String("UNAUTHORIZED_TYPE");
      await composableToken.createTokenTypes([unauthorizedType]);

      await expect(orchestrator.mintChildrenAndParent(
        testConsts.ARTPIECE_TYPE,
        testConsts.TOKEN_URI,
        unauthorizedType,
        [testConsts.TOKEN_URI],
        [1],
        creator.address
      )).to.be.revertedWith("Recipient token has not been authorized to receive this child");
    });
  });
});
