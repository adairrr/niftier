import { ethers, upgrades } from "hardhat";
import { BigNumber, constants, utils, Contract, ContractFactory } from "ethers";
import { use, expect } from 'chai';
import { AccessRestriction, TypedERC1155Composable } from "../../typechain";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import * as testUtils from './ERC1155ComposableShared';

import { solidity } from "ethereum-waffle";

use(solidity);

describe("TypedERC1155Composable", async () => {

  // contract instances
  let accessRestriction: AccessRestriction;
  let composableToken: TypedERC1155Composable;
  let composableTokenAsUser: TypedERC1155Composable;

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
  const ARTPIECE_TYPE = utils.formatBytes32String("ARTPIECE_TYPE");
  const LAYER_TYPE = utils.formatBytes32String("LAYER_TYPE");

  let AccessRestriction: ContractFactory;
  let TypedERC1155Composable: ContractFactory;

  beforeEach(async () => {
    // get contract factories
    AccessRestriction = await ethers.getContractFactory("AccessRestriction");
    TypedERC1155Composable = await ethers.getContractFactory("TypedERC1155Composable");

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
      [accessRestriction.address, TOKEN_NAME, BASE_URI],
      {unsafeAllowCustomTypes: true}
    ) as TypedERC1155Composable;

    // add a single artpiece type
    await composableToken.createTokenTypes([ARTPIECE_TYPE]);

    // console.log(await testtx.wait(1));

    // have an instance of this token with a random account as caller
    composableTokenAsUser = composableToken.connect(randomSigner);
  });

  describe('Initialization', async () => {
    it('should set all the defaults properly', async function () {
      expect(await composableToken.baseUri()).to.equal(BASE_URI);
      expect(await composableToken.name()).to.equal(TOKEN_NAME);
    });

    it("should reject any ether transfers", async function () {
      await expect(accounts[0].sendTransaction({ 
        to: composableToken.address, 
        value: 1 
      })).to.be.reverted;
    });
  });

  describe('Upgrades', () => {
    it('should be upgradeable', () => {
      
    });
  });

  describe('Admin methods', async () => {
    let accountWithToken: string;
    let mintedTokenId: BigNumber;

    // Mint a token so that we can query it
    beforeEach(async () => {
      accountWithToken = accounts[0].address;

      let mintTx = await composableToken.mint(
        accountWithToken, 
        ARTPIECE_TYPE, 
        TOKEN_URI, 
        1,
        creator.address, 
        utils.toUtf8Bytes('')
      );

      mintedTokenId = await testUtils.getTokenIdFromMint(mintTx);

      expect(mintTx).to.emit(composableToken, "TransferSingle")
        .withArgs(
          deployer.address, 
          constants.AddressZero, 
          accountWithToken, 
          mintedTokenId,
          1
        );
    });

    describe('setBaseUri', async () => {
      it('should update the base uri', async () => {
        const newBaseUri = "NEW_BASE_URI//";
        const expectedNewUri = newBaseUri + TOKEN_URI;

        // set the new base uri
        await expect(composableToken.setBaseUri(newBaseUri))
          .to.emit(composableToken, "BaseUriUpdated")
          .withArgs(newBaseUri);

        // ensure that the base uri was changed
        expect(await composableToken.baseUri()).to.equal(newBaseUri);

        // ensure that the uri was set for tokens as well
        expect(await composableToken.uri(mintedTokenId))
          .to.equal(expectedNewUri);
      });

      it('should not be callable non-admins', async () => {
        await expect(composableTokenAsUser.setBaseUri("YEET")).to.be.reverted;
      });
    });

    describe('setName', async () => {
      it('should update the token name', async () => {
        const newName = "NEW_NAME_HERE";
      
        // set the new name
        await expect(composableToken.setName(newName))
          .to.emit(composableToken, "TokenNameUpdated")
          .withArgs(newName);

        // ensure that the name was changed
        expect(await composableToken.name()).to.equal(newName);
      });

      it('should not be callable non-admins', async () => {
        await expect(composableTokenAsUser.setName("PORRIDGE")).to.be.reverted;
      });
    });

    describe('updateTokenUri', async () => {
      it('should update a token\'s uri', async () => {
        const newTokenUri = "newTokenUri";
        const expectedFullTokenUri = BASE_URI + newTokenUri;

        // set the token's new uri 
        await expect(composableToken.updateTokenUri(
          mintedTokenId, 
          newTokenUri
        )).to.emit(composableToken, "UriUpdated")
          .withArgs(mintedTokenId, newTokenUri);

        // ensure that the new token uri was changed
        expect(await composableToken.tokenUris(mintedTokenId))
          .to.equal(newTokenUri);

        // ensure that the new uri is concatanated 
        expect(await composableToken.uri(mintedTokenId))
          .to.equal(expectedFullTokenUri);
      });

      // TODO this does not work
      // it('should allow for an ipfs uri', async () => {
      //   // Note: see https://api-blockchain-core.readthedocs.io/en/latest/dfs/ipfs.html
      //   // runtime.dfs.ipfsHashToBytes32('QmWmyoMoctfbAaiEs2G46gpeUmhqFRDW6KWo64y5r581Vz')
      //   // returns 0x7D5A99F603F231D53A4F39D1521F98D2E8BB279CF29BEBFD0687DC98458E7F89

      //   const ipfsTokenUri = "0x7D5A99F603F231D53A4F39D1521F98D2E8BB279CF29BEBFD0687DC98458E7F89";
      //   const expectedFullTokenUri = BASE_URI + ipfsTokenUri;

      //   // set the token's new uri 
      //   await expect(composableToken.updateTokenUri(
      //     mintedTokenId, 
      //     ipfsTokenUri
      //   )).to.emit(composableToken, "UriUpdated")
      //     .withArgs(mintedTokenId, ipfsTokenUri);

      //   console.log(await composableToken.tokenUris(mintedTokenId));

      //   // ensure that the new token uri was changed
      //   expect(await composableToken.tokenUris(mintedTokenId))
      //     .to.equal(ipfsTokenUri);

      //   // ensure that the new uri is concatanated 
      //   expect(await composableToken.uri(mintedTokenId))
      //     .to.equal(expectedFullTokenUri);
      // });

      it('should not be callable non-admins', async () => {
        await expect(composableTokenAsUser.updateTokenUri(
          mintedTokenId,
          "MUSK"
          )).to.be.reverted;
      });
    });

    describe('updateAccessRestriction', async () => {
      it('should update the access restriction', async () => {
        const exAccessRestriction = await composableTokenAsUser.accessRestriction();
    
        // deploy a new accessRestriction
        const newAccessRestriction = await upgrades.deployProxy(
          AccessRestriction,
          [deployer.address],
          {unsafeAllowCustomTypes: true}
        ) as AccessRestriction;

        // update
        await composableToken.updateAccessRestriction(newAccessRestriction.address);

        // compare
        expect(await composableToken.accessRestriction()).to.equal(newAccessRestriction.address);
        expect(await composableToken.accessRestriction()).to.not.equal(exAccessRestriction);
      });

      it('should disallow addresses that are not of the accessControls instance', async () => {
        // this will fail on the method call 'isAccessRestriction'
        await expect(composableToken.updateAccessRestriction(composableToken.address))
          .to.be.reverted;
      });

      it('should not be callable by non-admins', async () => {
        await expect(composableTokenAsUser.updateAccessRestriction(minter.address)).to.be.reverted;
      });
    });

    describe('authorizeChildContract', async () => {
      it('should add an authorized child contract', async () => {
        const accessRestrictionAddress = await composableTokenAsUser.accessRestriction();
    
        // deploy a new TypedERC1155Composable
        const newComposable = await upgrades.deployProxy(
          TypedERC1155Composable,
          [accessRestrictionAddress, TOKEN_NAME, BASE_URI],
          {unsafeAllowCustomTypes: true}
        ) as TypedERC1155Composable;

        // check that the contract was not previously authorized
        expect(await composableToken.isAuthorizedChildContract(
          newComposable.address
        )).false;

        // add to authorized child contracts
        await composableToken.authorizeChildContract(newComposable.address);

        // compare
        expect(await composableToken.isAuthorizedChildContract(
          newComposable.address
        )).true;

      });

      it('should disallow addresses that are not ERC1155 contracts', async () => {
        // TODO check with non-upgradeable ERC1155 contracts
        await expect(composableToken.authorizeChildContract(accessRestriction.address))
          .to.be.reverted;
      });

      it('should not be callable by non-admins', async () => {
        // using deployer address because it will fail on admin check first
        await expect(composableTokenAsUser.authorizeChildContract(deployer.address))
          .to.be.revertedWith("AccessRestrictable.onlyAdmin: Sender must have admin role.")
      });
    });

    describe('createTokenTypes', async () => {
      it('should create a token type', async () => {
        let newTokenType = utils.formatBytes32String("THIS_IS_A_NEW_TYPE");
        // this index is because we have only created one other type
        let tokenTypeIndex = 2;
        await expect(composableToken.createTokenTypes(
          [newTokenType]
        )).to.emit(composableToken, "TokenTypesCreated")
          .withArgs([newTokenType], [tokenTypeIndex]);
      });

      it('should have new tokens created with same type to have same type prefix', async () => {
        let newTokenType = utils.formatBytes32String("THIS_IS_A_NEW_TYPE");
        // this index is because we have only created one other type
        let tokenTypeIndex = 2;
        await expect(composableToken.createTokenTypes(
          [newTokenType]
        )).to.emit(composableToken, "TokenTypesCreated")
          .withArgs([newTokenType], [tokenTypeIndex]);
      });
      
      it('should disallow a token type of the same name', async () => {
        await expect(composableToken.createTokenTypes([ARTPIECE_TYPE]))
          .to.be.revertedWith("Already a type");
      });

      it('should not allow more than 255 types', async () => {
        // this is the better way to do this, but it exceeds max length of string[]
        // let typeArray: string[] = new Array(254);
        // for (let index = 0; index < 254; index++) {
        //   typeArray[index] = utils.formatBytes32String(index.toString());
        // }
        // await expect(composableToken.createTokenTypes(typeArray))
        //   .to.not.be.reverted;

        // create 254 more
        for (let index = 0; index < 254; index++) {
          composableToken.createTokenTypes([utils.formatBytes32String(index.toString())]);
        }

        await expect(composableToken.createTokenTypes(
          [utils.formatBytes32String("FAIL")]
        )).to.be.revertedWith("Too many types");
      });
    });

    describe('authorizeChildType', async () => {
      it('should add an authorized child type', async () => {

        // Create a second type
        await composableToken.createTokenTypes([LAYER_TYPE]);

        let childTokenId = await testUtils.mintAndGetId(
          composableToken,
          accountWithToken,
          LAYER_TYPE,
          TOKEN_URI + "DIFFERENT", // the token uri will be different,
          1,
          minter.address
        );

        await expect(composableToken.authorizeChildType(mintedTokenId, childTokenId))
          .to.emit(composableToken, "ChildTypeAuthorized")
          .withArgs(
            await testUtils.getTokenTypeFromId(composableToken, mintedTokenId),
            await testUtils.getTokenTypeFromId(composableToken, childTokenId),
          );
      });

      it('should be able to authorize itself', async () => {
        await expect(composableToken.authorizeChildType(mintedTokenId, mintedTokenId))
          .to.emit(composableToken, "ChildTypeAuthorized")
          .withArgs(
            await testUtils.getTokenTypeFromId(composableToken, mintedTokenId),
            await testUtils.getTokenTypeFromId(composableToken, mintedTokenId),
          );
      });

      it('should not be callable by non-admins', async () => {
        // using deployer address because it will fail on admin check first
        await expect(composableTokenAsUser.authorizeChildType(mintedTokenId, mintedTokenId))
          .to.be.revertedWith("AccessRestrictable.onlyAdmin: Sender must have admin role.")
      });
    });
  });
  
  describe('Composability', async () => {

    describe('Child Contract Composability', async () => {
      let childComposableToken: Contract;
      let parentTokenId: BigNumber;
    
      beforeEach(async () => {
        // mint a token in the parent contract
        parentTokenId = await testUtils.mintAndGetId(
          composableToken,
          creator.address, 
          ARTPIECE_TYPE, 
          TOKEN_URI, 
          1, 
          creator.address
        );
  
        // deploy another TypedERC1155Composable contract
        childComposableToken = await upgrades.deployProxy(
          TypedERC1155Composable,
          [accessRestriction.address, TOKEN_NAME, BASE_URI],
          {unsafeAllowCustomTypes: true}
        ) as TypedERC1155Composable;
  
        // create the LAYER TYPE for the child composable... because why not
        await childComposableToken.createTokenTypes([LAYER_TYPE]);
      });
  
      describe('Authorized child contracts', async () => {
        it('should allow receiving of authorized ERC1155 tokens (in this case: by the same creator)', async () => {
          // authorize the composableToken to have the childComposableToken
          await composableToken.authorizeChildContract(childComposableToken.address);

          const childTokenId = await testUtils.mintAndGetId(
            childComposableToken,
            creator.address,
            LAYER_TYPE,
            TOKEN_URI,
            1,
            creator.address
          );
  
          // send from childContract to composableContract
          await childComposableToken.connect(creator).safeTransferFrom(
            creator.address,
            composableToken.address,
            childTokenId,
            1,
            testUtils.packTokenId(parentTokenId)
          );

          await testUtils.expectChildToBeTransferred(
            composableToken, parentTokenId, childComposableToken, childTokenId, creator.address
          );
        });
  
        it('should allow minting of authorized ERC1155 tokens directly to a token', async () => {
          // authorize the composableToken to have the childComposableToken
          await composableToken.authorizeChildContract(childComposableToken.address);
          
          // mint a token in the child contract TO the parent contract
          let childTx = await childComposableToken.mint(
            composableToken.address, 
            LAYER_TYPE,
            TOKEN_URI,
            1,
            creator.address,
            testUtils.packTokenId(parentTokenId)
          );

          const childTokenId = await testUtils.getTokenIdFromMint(childTx);

          await testUtils.expectChildToBeTransferred(
            composableToken, parentTokenId, childComposableToken, childTokenId, creator.address
          );
        });
      });
  
      describe('Unuthorized child contracts', async () => {
        it('should revert when child contract is unauthorized', async () => {      
          // mint a token in the child contract TO the parent contract
          await expect(childComposableToken.mint(
            composableToken.address, 
            LAYER_TYPE,
            TOKEN_URI,
            1,
            creator.address,
            testUtils.packTokenId(parentTokenId)
          )).to.be.revertedWith("");
        });
      });
    });
    
    describe('Child Type Composability', async () => {

      let artpieceTokenId: BigNumber;
      let layerTokenId: BigNumber;
      
      beforeEach(async () => {
        // mint an artpiece (parent) token in the contract

        artpieceTokenId = await testUtils.mintAndGetId(
          composableToken,
          creator.address, 
          ARTPIECE_TYPE, 
          TOKEN_URI,
          1, 
          creator.address
        );

        // create the layer type in the contract
        await composableToken.createTokenTypes([LAYER_TYPE]);

        // mint an layer (child) token in the contract
        layerTokenId = await testUtils.mintAndGetId(
          composableToken,
          creator.address, 
          LAYER_TYPE, 
          TOKEN_URI,
          1, 
          creator.address
        );

        // sanity check
        expect(
          artpieceTokenId.eq(layerTokenId), 
          "Artpiece and layer token should NOT have the same id."
        ).to.be.false;
      });

      describe('Authorized child types', async () => {
        it('should allow receiving of child types within the same contract', async () => {
          //authorize the type to be received
          // let artpieceType = await composableToken.tokenType(artpieceTokenId);
          // let layerType = await composableToken.tokenType(layerTokenId);
          await composableToken.authorizeChildType(artpieceTokenId, layerTokenId);

          // send from self to self
          await composableToken.connect(creator).safeTransferFrom(
            creator.address,
            composableToken.address,
            layerTokenId,
            1,
            testUtils.packTokenId(artpieceTokenId)
          );

          await testUtils.expectChildToBeTransferred(
            composableToken, artpieceTokenId, composableToken, layerTokenId, creator.address
          );
        });

        it('should allow for minting of an authorized type directly to a token', async () => {
          
          // authorize the type to be received
          await composableToken.authorizeChildType(artpieceTokenId, layerTokenId);

          // let childTypeTx = await composableToken.mint(
          //   composableToken.address,
          //   LAYER_TYPE,
          //   TOKEN_URI + "NEW", // already one with TOKEN_URI
          //   1,
          //   creator.address,
          //   testUtils.packTokenId(artpieceTokenId)
          // );

          // const childTokenId = await testUtils.getTokenIdFromMint(childTypeTx);

          let childTokenId = await testUtils.mintAndGetId(
            composableToken,
            composableToken.address,
            LAYER_TYPE,
            TOKEN_URI + "NEW", // already one with TOKEN_URI
            1,
            creator.address,
            artpieceTokenId
          );

          console.log(layerTokenId);
          console.log(childTokenId);
          console.log(await composableToken.tokenType(layerTokenId));
          console.log(await composableToken.tokenType(childTokenId));

          await testUtils.expectChildToBeTransferred(
            composableToken, artpieceTokenId, composableToken, childTokenId, creator.address
          );
        });
      });
  
      describe('Unauthorized child types', async () => {
        it('should revert when child type is unauthorized', async () => {
          let unauthorizedType = utils.formatBytes32String("UNAUTHORIZED_TYPE");

          await composableToken.createTokenTypes([unauthorizedType]);

          // mint a token of the unauthorized type
          let unauthorizedTokenId = await testUtils.mintAndGetId(
            composableToken,
            creator.address, 
            unauthorizedType, 
            TOKEN_URI,
            1, 
            creator.address
          );
  
          // send from self to self
          await expect(composableToken.connect(creator).safeTransferFrom(
            creator.address,
            composableToken.address,
            unauthorizedTokenId,
            1,
            testUtils.packTokenId(artpieceTokenId)
          )).to.be.revertedWith("The parent token is not authorized to hold the child token.");
        });

        it('should revert when child type DNE', async () => {
          // artpiece tokenId type already exists
          await expect(composableToken.authorizeChildType(artpieceTokenId, BigNumber.from(0)))
            .to.be.revertedWith("Parent and child types must exist before being authorized");
        });

        it('should revert when parent type DNE', async () => {
          await expect(composableToken.authorizeChildType(BigNumber.from(0), artpieceTokenId))
            .to.be.revertedWith("Parent and child types must exist before being authorized");
        });
      });
    });
  });

  describe('Minting', async () => {
    describe('Success', async () => {
      it('should mint properly as admin and return token id', async () => {
        const tokenAmount = 20;

        let mintedTokenId = await testUtils.mintAndGetId(
          composableToken,
          minter.address, 
          ARTPIECE_TYPE, 
          TOKEN_URI, 
          tokenAmount, 
          creator.address
        );

        // check amount minted
        expect(await composableToken.tokenSupply(mintedTokenId))
          .to.equal(BigNumber.from(tokenAmount));

        // check uri
        expect(await composableToken.uri(mintedTokenId))
          .to.equal(BASE_URI + TOKEN_URI);

        let [tokenTypeId, tokenTypeName] = await composableToken.tokenType(mintedTokenId);
        
        // check type index (1 because first)
        expect(tokenTypeId).to.equal(1);
        // check type name
        expect(tokenTypeName).to.equal(ARTPIECE_TYPE);

        // TODO check creators
      });

      it('should generate different ids with the same creator but different uris', async () => {
        let firstMintedTokenId = await testUtils.mintAndGetId(
          composableToken,
          minter.address, 
          ARTPIECE_TYPE, 
          TOKEN_URI, 
          1, 
          creator.address
        );

        let secondMintedTokenId = await testUtils.mintAndGetId(
          composableToken,
          minter.address, 
          ARTPIECE_TYPE, 
          TOKEN_URI + "DIFFERENT", 
          1, 
          creator.address
        );

        expect(firstMintedTokenId).to.not.equal(secondMintedTokenId);
      });

    });
    describe('Reversion', () => {
      it('should only allow minter to mint', async () => {
        await expect(composableTokenAsUser.mint(
          minter.address, 
          ARTPIECE_TYPE, 
          TOKEN_URI,
          1, 
          creator.address, 
          utils.toUtf8Bytes('')
        )).to.be.reverted;
      });

      it('should only allow the creator of the token to mint more of the token', async () => {
        // the token ids are based on the creator and the token uri, so if they're the same, though with
        // a different creator, then it should fail
        await expect(composableToken.mint(
          minter.address, 
          ARTPIECE_TYPE, 
          TOKEN_URI,
          1, 
          creator.address, 
          utils.toUtf8Bytes('')
        )).to.not.be.reverted;

        
        await expect(composableToken.mint(
          minter.address, 
          ARTPIECE_TYPE, 
          TOKEN_URI,
          1, 
          minter.address, // fail because the creator is different
          utils.toUtf8Bytes('')
        )).to.be.revertedWith("Only the creator of the token may mint more");
      });

      it('should not allow minting to the zero address', async () => {
        await expect(composableToken.mint(
          ethers.constants.AddressZero, 
          ARTPIECE_TYPE, 
          TOKEN_URI, 
          1, 
          creator.address, 
          utils.toUtf8Bytes('')
        )).to.be.reverted;
      });

      it('should not allow the creator to be the zero address', async () => {
        await expect(
          composableToken.mint(
            minter.address, 
              ARTPIECE_TYPE, 
              TOKEN_URI, 
              1, 
              ethers.constants.AddressZero, 
              utils.toUtf8Bytes(''))
        ).to.be.revertedWith('Creator is zero address.');
      });

      it('should not allow the uri to be empty', async () => {
        await expect(
          composableToken.mint(minter.address, 
            ARTPIECE_TYPE, 
            '',
            1, 
            creator.address, 
            utils.toUtf8Bytes(''))
        ).to.be.revertedWith('Token URI is empty.');
      });
    });
  });

  describe('Transactions', () => {
    let artpieceTokenId: BigNumber;
    let otherArtpieceTokenId: BigNumber;
    let layerTokenId: BigNumber;
      
    beforeEach(async () => {
      // mint an artpiece (parent) token in the contract
      artpieceTokenId = await testUtils.mintAndGetId(
        composableToken,
        creator.address, 
        ARTPIECE_TYPE, 
        TOKEN_URI,
        1, 
        creator.address
      );

      // mint a second artpiece (parent) token in the contract
      otherArtpieceTokenId = await testUtils.mintAndGetId(
        composableToken,
        creator.address, 
        ARTPIECE_TYPE, 
        TOKEN_URI + "OTHRE",
        1, 
        creator.address
      );

      // create the layer type in the contract
      await composableToken.createTokenTypes([LAYER_TYPE]);

      // mint layer to creator
      layerTokenId = await testUtils.mintAndGetId(
        composableToken,
        creator.address, 
        LAYER_TYPE, 
        TOKEN_URI,
        1,
        creator.address
      );

      // sanity check
      expect(
        artpieceTokenId.eq(layerTokenId), 
        "Artpiece and layer token should NOT have the same id."
      ).to.be.false;

      // authorize the token
      await composableToken.authorizeChildType(artpieceTokenId, layerTokenId);

      
      // TODO TODO TODO this needs to be done in the deploy script!!!!!
      // await composableToken.setApprovalForAll(composableToken.address, true);

      // transfer layer (child) token to artpiece (parent) token
      await composableToken.connect(creator).safeTransferFrom(
        creator.address,
        composableToken.address,
        layerTokenId,
        1,
        testUtils.packTokenId(artpieceTokenId)
      );

      // verify that the token was transferred
      await testUtils.expectChildToBeTransferred(
        composableToken,
        artpieceTokenId,
        composableToken,
        layerTokenId,
        creator.address
      );
    });

    describe('safeTransferChildFrom', async () => {
      // TODO this is completely broken :(

    //   it('should transfer the child of a token to another token', async () => {
    //     console.log("creator address: " + creator.address);
    //     let transferTx = await composableToken.connect(creator).safeTransferChildFrom(
    //       artpieceTokenId,
    //       composableToken.address,
    //       composableToken.address,
    //       layerTokenId,
    //       1,
    //       testUtils.packTokenId(otherArtpieceTokenId)
    //     );

    //     expect(transferTx).to.emit(composableToken, "TransferSingle")
    //       .withArgs(
    //         deployer.address,
    //         composableToken.address,
    //         composableToken.address,
    //         layerTokenId,
    //         1
    //     );

    //     expect(transferTx).to.emit(composableToken, "TransferChildToken")
    //       .withArgs(
    //         artpieceTokenId, 
    //         composableToken.address, 
    //         composableToken.address, 
    //         layerTokenId, 
    //         1
    //       );
    //   });

      it('should not allow transfer to the zero address', async () => {
        await expect(composableToken.safeTransferChildFrom(
          artpieceTokenId,
          constants.AddressZero,
          composableToken.address,
          layerTokenId,
          1,
          testUtils.packTokenId(otherArtpieceTokenId)
        )).to.be.revertedWith("Transfer to the zero address");
      });
    });
  });
});
