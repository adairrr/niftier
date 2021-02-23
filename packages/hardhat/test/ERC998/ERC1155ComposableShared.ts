import { BigNumber, constants, utils, ContractFactory, ContractTransaction, Contract } from "ethers";
import { use, expect } from 'chai';

import { solidity } from "ethereum-waffle";

use(solidity);

export function generateTokenId(tokenType: string, tokenUri: string, tokenCreator: string) {
  // TODO notice that this does not deal with clashes....
  
  
  console.log("FIRST: " + BigNumber.from(utils.solidityKeccak256(
    ['bytes32'],
    [utils.formatBytes32String(
      utils.defaultAbiCoder.encode(
      ['string'], 
      [tokenType]
    ))]
  )));

  console.log("SECOND: " + BigNumber.from(
    utils.solidityKeccak256(
      ['bytes32'],
      [utils.defaultAbiCoder.encode(
        ['address', 'string'], 
        [tokenCreator, tokenUri]
      )]
    )
  ).shr(16));
  
  return BigNumber.from(utils.solidityKeccak256(
    ['bytes32'],
    [utils.defaultAbiCoder.encode(
      ['string'], 
      [tokenType]
    )]
  )).or(
    BigNumber.from(
      utils.solidityKeccak256(
        ['bytes32'],
        [utils.defaultAbiCoder.encode(
          ['address', 'string'], 
          [tokenCreator, tokenUri]
        )]
      )
    ).shr(16)
  );

}

// Helper to parse the return of the mint function 
// TODO this is hacky and there should be a way better way to do this.
export async function getTokenIdFromMint(mintTx: ContractTransaction) {
  return BigNumber.from((await mintTx.wait(1)).logs[0].data.substring(0, 66));
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

// export funct