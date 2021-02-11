const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("ethers");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { ZERO_BYTES32 } = require('@openzeppelin/test-helpers').constants;
const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

use(solidity);

describe("ERC1155Composable", function () {

  // contract instances
  let accessRestriction;
  let composableToken;
  let composableTokenAsUser;

  // signers
  let deployer;
  let minter;
  let creator;
  let randomSigner;
  let accounts;

  // constants
  const BASE_URI = "BASE_URI";
  const TOKEN_URI = "TOKEN_URI";
  const TOKEN_ONE_ID = BigNumber.from(0);

  beforeEach(async () => {
    // get array of signers
    [deployer, minter, creator, randomSigner, ...accounts] = await ethers.getSigners();
    // console.log(accounts);

    const AccessRestriction = await ethers.getContractFactory("AccessRestriction");
    const ERC1155Composable = await ethers.getContractFactory("ERC1155Composable");

    // deploy accessRestriction
    accessRestriction = await upgrades.deployProxy(
      AccessRestriction,
      [deployer.address],
      {unsafeAllowCustomTypes: true}
    );

    // add minter role to minter
    await accessRestriction.addMinter(minter.address);


    // deploy erc1155Composable
    composableToken = await upgrades.deployProxy(
      ERC1155Composable,
      [accessRestriction.address, BASE_URI],
      {unsafeAllowCustomTypes: true}
    );

    // have an instance of this token with a random account as caller
    composableTokenAsUser = composableToken.connect(randomSigner);

  });

  describe('Initialization', async () => {
    it('should set all the defaults properly', async function () {
      expect(await composableToken.baseUri()).to.equal(BASE_URI);
    });

    it("should reject any ether transfers", async function () {
      await expect(accounts[0].sendTransaction({ to: composableToken.address, value: 1 })).to.be.reverted;
    });
  });

  describe('Upgrades', () => {
    it('should be upgradeable', () => {
      
    });
  });

  describe('Admin methods', async () => {
    let accountWithToken;

    // Mint a token so that we can query it
    beforeEach(async () => {
      accountWithToken = await accounts[0].address;
      await composableToken.mint(accountWithToken, TOKEN_URI, 1, creator.address);
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
        expect(await composableToken.uri(TOKEN_ONE_ID))
          .to.equal(expectedNewUri);
      });

      it('should not be callable non-admins', async () => {
        await expect(composableTokenAsUser.setBaseUri("YEET")).to.be.reverted;
      });
    });

    describe('updateTokenUri', async () => {
      it('should update a token\'s uri', async () => {
        const newTokenUri = "newTokenUri";
        const expectedFullTokenUri = BASE_URI + newTokenUri;

        // // mint a token
        // composableToken.mint(minter.address, TOKEN_URI, 1, creator.address);

        // set the token's new uri 
        await expect(composableToken.updateTokenUri(TOKEN_ONE_ID, newTokenUri))
          .to.emit(composableToken, "UriUpdated")
          .withArgs(TOKEN_ONE_ID, newTokenUri);

        console.log(await composableToken.tokenUris(TOKEN_ONE_ID));

        // ensure that the new token uri was changed
        expect(await composableToken.tokenUris(TOKEN_ONE_ID)).to.equal(newTokenUri);

        // ensure that the new uri is concatanated 
        expect(await composableToken.uri(TOKEN_ONE_ID))
          .to.equal(expectedFullTokenUri);
      });

      it('should not be callable non-admins', async () => {
        await expect(composableTokenAsUser.updateTokenUri(TOKEN_ONE_ID, "MUSK"))
          .to.be.reverted;
      });
    });

    describe('updateAccessRestriction', async () => {
      it('should update the access restriction', async () => {
        const exAccessRestriction = await composableTokenAsUser.accessRestriction();

        const AccessRestriction = await ethers.getContractFactory("AccessRestriction");
    
        // deploy a new accessRestriction
        const newAccessRestriction = await upgrades.deployProxy(
          AccessRestriction,
          [deployer.address],
          {unsafeAllowCustomTypes: true}
        );

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

      it('should not be callable non-admins', async () => {
        await expect(composableTokenAsUser.updateAccessRestriction(minter.address)).to.be.reverted;
      });
    });
  });

  describe('Minting', () => {
    describe('Success', () => {
      it('should mint properly as admin and return token 0', async () => {
        const tokenAmount = 20;
        
        await expect(composableToken.mint(minter.address, TOKEN_URI, tokenAmount, creator.address))
          .to.not.be.reverted;

        // check amount minted
        expect(await composableToken.tokenSupply(TOKEN_ONE_ID))
          .to.equal(BigNumber.from(tokenAmount));

        // check uri
        expect(await composableToken.uri(TOKEN_ONE_ID))
          .to.equal(BASE_URI + TOKEN_URI);

        // check creators
        

      });
    });
    describe('Reversion', () => {
      it('should only allow minter to mint', async () => {
        await expect(composableTokenAsUser.mint(minter.address, TOKEN_URI, 1, creator.address))
          .to.be.reverted;
      });
    });
  });

  describe('Transactions', () => {

  });
  
  // // Test case
  // it('should grant default admin role to deployer', async function () {
  //   // DEFAULT_ADMIN_ROLE == ZERO_BYTES32
  //   expect(await composableToken.getRoleMemberCount(ZERO_BYTES32)).to.equal(1);
  //   expect(await composableToken.isAdmin(deployer.address)).to.equal(true);
  // });
});
