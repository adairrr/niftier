import { ethers, upgrades } from "hardhat";
import { BigNumber, constants, utils, Contract, ContractFactory } from "ethers";
import { use, expect } from 'chai';
import { AccessRestriction, TypedERC1155Composable, ComposableOrchestrator } from "../../typechain";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import * as testUtils from './ERC1155ComposableShared';
import * as testConsts from './constants';

import { solidity } from "ethereum-waffle";
// import { hex } from "chalk";

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
    await composableToken.authorizeChildType(
      tokenTypes[0].shl(240), 
      tokenTypes[1].shl(240)
    );

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
        childTokenUris.push(testConsts.TOKEN_URI.concat(i.toString()));
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

  describe('mintChildrenToParent', async () => {
    let parentTokenId: BigNumber;
    let childTokenCount = 5;
    let childTokenUris: Array<string>;
    let childTokenAmounts: Array<number>;

    
    beforeEach(async () => {
      // mint a parent token to creator
      parentTokenId = await testUtils.mintAndGetId(
        composableToken,
        creator.address,
        testConsts.ARTPIECE_TYPE,
        testConsts.TOKEN_URI,
        1,
        creator.address
      );

      childTokenUris = new Array<string>();
      childTokenAmounts = new Array<number>();

      // create arrays for 5 layers
      for (let i = 0; i < childTokenCount; i++) {
        childTokenUris.push(testConsts.TOKEN_URI.concat(i.toString()));
        childTokenAmounts.push(1);
      }
    });

    it('should mint new children to an existing parent', async () => {
      // call the function
      let newChildrenToParentTx = await orchestrator.mintChildrenToParent(
        parentTokenId,
        testConsts.LAYER_TYPE,
        childTokenUris,
        childTokenAmounts,
        creator.address
      );

      let childTokenIds = await composableToken.childTokensOf(
        parentTokenId, 
        composableToken.address
      );

      // check that the children were associated
      expect(childTokenIds).to.have.lengthOf(childTokenCount);

      console.log(deployer.address);
      console.log(composableToken.address);
      console.log(orchestrator.address);
      console.log(creator.address);
      
      await expect(newChildrenToParentTx).to.emit(composableToken, "TransferBatch")
        .withArgs(
          orchestrator.address, // caused the transaction
          constants.AddressZero, // mint address
          composableToken.address, // address of contract because internal transfer
          childTokenIds,
          childTokenAmounts
        );      
    });

    it('should throw when the parent token doesn\'t exist', async () => {
      await expect(orchestrator.mintChildrenToParent(
        parentTokenId.add(1), // just add one to screw up the id
        testConsts.LAYER_TYPE,
        childTokenUris,
        childTokenAmounts,
        creator.address
      )).to.be.revertedWith("Recipient token does not exist");
    });

    it('should mint a second child when a child already exists (same creator)', async () => {
      // this should generate the same id as the first child
      let dupeChildId = await testUtils.mintAndGetId(
        composableToken,
        creator.address,
        testConsts.LAYER_TYPE,
        childTokenUris[0],
        1,
        creator.address
      );

      await expect(orchestrator.mintChildrenToParent(
        parentTokenId,
        testConsts.LAYER_TYPE,
        childTokenUris,
        childTokenAmounts,
        creator.address
      )).to.not.be.reverted;

      await testUtils.expectChildTokensToInclude(
        composableToken,
        parentTokenId,
        [dupeChildId]
      );

      let childTokenIds = await composableToken.childTokensOf(
        parentTokenId, 
        composableToken.address
      ) as BigNumber[];

      let hexChildTokenIds = childTokenIds.map(b => b.toHexString());

      // check still correct amount of children
      expect(childTokenIds).to.have.lengthOf(childTokenCount);

      // check that the id is the same (sanity)
      expect(hexChildTokenIds).to.include(dupeChildId.toHexString());

      // check supply is 2
      expect(await composableToken.tokenSupply(dupeChildId))
        .to.equal(2);


      // check that creator can still transfer token
      // TODO
    });

    it('should throw when the creator does not have approval for the parent token', async () => {
      // mint to randomsigner, creator should not have approval anymore, so checks that too
      let unauthorizedParent = await testUtils.mintAndGetId(
        composableToken,
        randomSigner.address,
        testConsts.LAYER_TYPE,
        childTokenUris[0],
        1,
        creator.address
      );

      await expect(orchestrator.mintChildrenToParent(
        unauthorizedParent,
        testConsts.LAYER_TYPE,
        childTokenUris,
        childTokenAmounts,
        creator.address
      )).to.be.revertedWith("Recipient token has not been authorized to receive this child");
    });
  });

  describe('mintParentAndAssociateChildren', async () => {
    let childTokenAmounts: Array<number>;
    let childTokenIds: Array<BigNumber>;
    let childTokenCount = 5;

    beforeEach(async () => {

      let childTokenUris = new Array<string>();
      childTokenAmounts = new Array<number>();

      // create arrays for 5 layers
      for (let i = 0; i < childTokenCount; i++) {
        childTokenUris.push(testConsts.TOKEN_URI.concat(i.toString()));
        childTokenAmounts.push(1);
      }

      let batchMintTx = await composableToken.mintBatch(
        creator.address,
        testConsts.LAYER_TYPE,
        childTokenUris,
        childTokenAmounts,
        creator.address,
        utils.toUtf8Bytes('')
      );

      childTokenIds = await testUtils.getTokenIdsFromBatchMint(batchMintTx, childTokenCount);
    });

    it('should associate existing children to a new parent', async () => {
      // TODO the orchestrator should be able to build the meta transaction calls and the
      // people calling it shouldn't have to have the minter role...

      // give the creator minter role until fixed
      // await accessRestriction.addMinter(creator.address);

      // give approval to orchestrator
      await composableToken.connect(creator).setApprovalForAll(orchestrator.address, true);
      // console.log(orchestrator.address);
      // console.log(composableToken.address);

      // call the function
      let associateChildrenTx = await orchestrator.connect(creator).mintParentAndAssociateChildren(
        testConsts.ARTPIECE_TYPE,
        testConsts.TOKEN_URI.concat("unique"),
        childTokenIds,
        childTokenAmounts,
        creator.address
      );

      let newParentTokenId = await testUtils.getTokenIdFromMint(associateChildrenTx);

      await testUtils.expectParentTokensToEqual(
        composableToken,
        childTokenIds,
        [newParentTokenId]
      );

      // // check that the children were associated
      // expect(childTokenIds).to.have.lengthOf(childTokenCount);

      // console.log(deployer.address);
      // console.log(composableToken.address);
      // console.log(orchestrator.address);
      // console.log(creator.address);
      
      // await expect(newChildrenToParentTx).to.emit(composableToken, "TransferBatch")
      //   .withArgs(
      //     orchestrator.address, // caused the transaction
      //     constants.AddressZero, // mint address
      //     composableToken.address, // address of contract because internal transfer
      //     childTokenIds,
      //     childTokenAmounts
      //   );      
    });
    
    it('should throw if one of the children does not exist', async () => {
      
    });
    
    it('shouldn\'t allow children to be associated if not owned by creator', async () => {
      
    });

    it('should throw if an amount of child tokens is greater than exists', async () => {
      
    });
  });

  describe('associateChildrenToParent', async () => {
    let parentTokenId: BigNumber;
    let childTokenIds: Array<BigNumber>;

    beforeEach(async () => {

    });

    it('', async () => {
      
    });
    
    it('', async () => {
      
    });
    
    it('', async () => {
      
    });

    it('', async () => {
      
    });
  });
});
