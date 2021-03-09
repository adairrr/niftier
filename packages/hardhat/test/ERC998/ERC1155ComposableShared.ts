import { BigNumber, constants, utils, ContractFactory, ContractTransaction, Contract, Event } from "ethers";
import { use, expect } from 'chai';
import { ethers, upgrades } from "hardhat";
import { solidity } from "ethereum-waffle";
import * as testConsts from './constants';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

use(solidity);

// Helper to parse the return of the mint function 
// TODO this is hacky and there should be a way better way to do this.
export async function getTokenIdFromMint(mintTx: ContractTransaction, logIndex = 1) {
  // log index is 1 because there is an approval event fired before mint events
  return BigNumber.from((await mintTx.wait(1)).logs[logIndex].data.substring(0, 66));
}

// TODO migrate from above to this
export async function getTokenIdFromMint2(mintTx: ContractTransaction) {
  let events = (await mintTx.wait(1)).events;
  let mintEvent: Event;

  console.log(events);

  // find ApprovalEvent
  events.forEach(logEvent => {
    if (logEvent.event == "Mint") {
      mintEvent = logEvent;
    }
  });

  // ensure the event was found
  if (!mintEvent) throw "No Mint event was found!";

  return mintEvent.args["tokenId"];
}

// TODO use the mintbatch event
export async function getTokenIdsFromBatchMint(
  batchMintTx: ContractTransaction, 
  mintCount: number
) {
  let tokenIds: Array<BigNumber>;
  let events = (await batchMintTx.wait(1)).events;
  let approvalEvent: Event;

  // find BatchApprovalEvent
  events.forEach(logEvent => {
    if (logEvent.event == "BatchApproval") {
      approvalEvent = logEvent;
    }
  });

  // ensure the event was found
  if (!approvalEvent) throw "No BatchApproval event was found!";

  // split into 64 char chunks after pulling the returned ids
  tokenIds = approvalEvent.data
    .substr(approvalEvent.data.length - 64 * mintCount)
    .match(/.{1,64}/g)
    .map(hex => BigNumber.from('0x'.concat(hex)));

  return tokenIds;
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
  let childTokens = await parentToken.childTokensOf(parentTokenId, childToken.address) as BigNumber[];

  expect(childTokens[0]).to.equal(childTokenId);
  // TODO WHY DOES THIS NOT WORK!? it worked before.... :(
  // TODO
  //   let hexChildTokens = childTokens.map(b => b.toHexString());
  // expect(hexChildTokens)
  //   .to.include([childTokenId.toHexString()]);

  // check that the creator no longer has the child token
  expect(await childToken.balanceOf(childTokenCreator, childTokenId))
    .to.equal(0);

  let parentTokens = await parentToken.parentTokensOf(childToken.address, childTokenId);
  expect(parentTokens[0]).to.equal(parentTokenId);
  // expect(await parentToken.parentTokensOf(childToken.address, childTokenId))
  //   .to.deep.include.keys([parentTokenId]);
}

export function hexesFromIds(tokenIds: BigNumber[]) {
  return tokenIds.map(bn => bn.toHexString());
}

export async function expectParentTokensToEqual(
  composableContract: Contract,
  childTokenIds: BigNumber[],
  expectedParentTokenIds: BigNumber[]
) {
  let expectedParentHexes = hexesFromIds(expectedParentTokenIds);

  childTokenIds.forEach(async childId => {
    let parentTokenHexes = hexesFromIds(
      await composableContract.parentTokensOf(
        composableContract.address, 
        childId
      )
    );
    expect(parentTokenHexes).to.deep.equal(expectedParentHexes);
  });
}

export async function expectChildTokensToInclude(
  composableContract: Contract,
  parentTokenId: BigNumber,
  expectedChildTokenIds: BigNumber[]
) {
  let [actualChildren, expectedChildren] = await actualAndExpectedChildrenHexes(
    composableContract, 
    parentTokenId, 
    expectedChildTokenIds
  );
  expect(actualChildren).to.include.members(expectedChildren);
}

export async function expectChildTokensToEqual(
  composableContract: Contract,
  parentTokenId: BigNumber,
  expectedChildTokenIds: BigNumber[]
) {
  let [actualChildren, expectedChildren] = await actualAndExpectedChildrenHexes(
    composableContract, 
    parentTokenId, 
    expectedChildTokenIds
  );
  expect(actualChildren).to.deep.equal(expectedChildren);
}

export async function actualAndExpectedChildrenHexes(
  composableContract: Contract,
  parentTokenId: BigNumber,
  expectedChildTokenIds: BigNumber[]
) {
  let expectedChildHexes = hexesFromIds(expectedChildTokenIds);

  let actualChildHexes = hexesFromIds(
    await composableContract.childTokensOf(
      parentTokenId,
      composableContract.address
    )
  );
  return [actualChildHexes, expectedChildHexes];
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

export function generateTokenUrisAndAmounts(howMany: number): [Array<string>, Array<number>] {
  let childTokenUris = new Array<string>();
  let childTokenAmounts = new Array<number>();

  // create arrays for 5 layers
  for (let i = 0; i < howMany; i++) {
    childTokenUris.push(testConsts.TOKEN_URI.concat(i.toString()));
    childTokenAmounts.push(1);
  }
  return [childTokenUris, childTokenAmounts];
}

export async function batchMintTokens(
  composableToken: Contract,
  creator: SignerWithAddress,
  tokenUris: Array<string>,
  tokenAmounts: Array<number>
): Promise<BigNumber[]> {
  let batchMintTx = await composableToken.mintBatch(
    creator.address,
    testConsts.LAYER_TYPE,
    tokenUris,
    tokenAmounts,
    creator.address,
    utils.toUtf8Bytes('')
  );

  return await getTokenIdsFromBatchMint(batchMintTx, tokenAmounts.length);
}

// export async function mintToCreator(
//   composableContract: Contract,
//   tokenTypeName: string,
//   tokenUri: string,
//   amount = 1
// ) {
//   return await mintAndGetId(composableContract)
// }


