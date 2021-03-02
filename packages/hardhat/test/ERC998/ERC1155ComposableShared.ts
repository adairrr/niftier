import { BigNumber, constants, utils, ContractFactory, ContractTransaction, Contract } from "ethers";
import { use, expect } from 'chai';
import { ethers, upgrades } from "hardhat";
import { solidity } from "ethereum-waffle";
import * as testConsts from './constants';

use(solidity);

// Helper to parse the return of the mint function 
// TODO this is hacky and there should be a way better way to do this.
export async function getTokenIdFromMint(mintTx: ContractTransaction, logIndex = 1) {
  // log index is 1 because there is an approval event fired before mint events
  return BigNumber.from((await mintTx.wait(1)).logs[logIndex].data.substring(0, 66));
}

export async function expectChildToBeTransferred(
  parentToken: Contract, 
  parentTokenId: BigNumber,
  childToken: Contract, 
  childTokenId: BigNumber,
  childTokenCreator: string
) {
  // check the parent token's balance was updated 
  expect(await parentToken.childBalance(parentTokenId, childToken.address, childTokenId))
    .to.equal(1);

  // check that the childTokensOf method also returns the correct value
  let childTokens = await parentToken.childTokensOf(parentTokenId, childToken.address);

  expect(childTokens[0]).to.equal(childTokenId);
  // TODO WHY DOES THIS NOT WORK!? it worked before.... :(
  // expect(await parentToken.childTokensOf(parentTokenId, childToken.address))
  //   .to.deep.include.keys([childTokenId]);

  // check that the creator no longer has the child token
  expect(await childToken.balanceOf(childTokenCreator, childTokenId))
    .to.equal(0);

  let parentTokens = await parentToken.parentTokensOf(childToken.address, childTokenId);
  expect(parentTokens[0]).to.equal(parentTokenId);
  // expect(await parentToken.parentTokensOf(childToken.address, childTokenId))
  //   .to.deep.include.keys([parentTokenId]);
}

export async function mintAndGetId(
  composableContract: Contract,
  to: string,
  tokenType: string,
  tokenUri: string,
  amount: number,
  creator: string,
  toTokenId?: BigNumber
) {

  let tokenTx = await composableContract.mint(
    to, 
    tokenType, 
    tokenUri,
    BigNumber.from(amount), 
    creator,
    toTokenId ? packTokenId(toTokenId) : utils.toUtf8Bytes('')
  );

  return await getTokenIdFromMint(tokenTx);
}

// function to just parse the token type from the id in case the contract's method is wrong
export async function getTokenTypeFromId(
  composableContract: Contract,
  tokenId: BigNumber
) {
  return tokenId
    .and(await composableContract.TOKEN_TYPE_MASK())
    .shr(240);
}

export async function createTokenTypesAndGetIds(
  composableContract: Contract,
  tokenTypeNames: string[]
) {
  // create the types
  await composableContract.createTokenTypes(tokenTypeNames);

  // get the type ids from the contract to build the return array
  let newTypes: Array<BigNumber> = [];
  for (let i = 0; i < tokenTypeNames.length; i++) {
    newTypes.push(await composableContract.tokenTypeNameToId(tokenTypeNames[i]));
  }
  return newTypes;
}

export function packTokenId(toTokenId: BigNumber) {
  return utils.solidityPack(['uint256'], [toTokenId]);
}

// export async function mintToCreator(
//   composableContract: Contract,
//   tokenTypeName: string,
//   tokenUri: string,
//   amount = 1
// ) {
//   return await mintAndGetId(composableContract)
// }


