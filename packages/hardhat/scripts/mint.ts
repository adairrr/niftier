/* eslint no-use-before-define: "warn" */
import fs from "fs";
import chalk from "chalk";
import { config, ethers } from "hardhat";
import { utils, BigNumber } from "ethers";
import { TypedERC1155Composable } from "../typechain";
import * as testUtils from '../test/ERC998/ERC1155ComposableShared';
import * as testConsts from '../test/ERC998/constants';

import ipfsAPI from 'ipfs-http-client';
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const delayMS = 1000 //sometimes xDAI needs a 6000ms break lol 😅

const main = async () => {

  // ADDRESS TO MINT TO:
  const toAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  console.log("\n\n 🎫 Minting to " + toAddress + "...\n");

  const composableContract = await ethers.getContractAt(
    'TypedERC1155Composable', 
    fs.readFileSync("./artifacts/TypedERC1155Composable.address").toString()
  ) as TypedERC1155Composable;


  const buffalo = {
    "description": "It's actually a bison?",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/buffalo.jpg",
    "name": "Buffalo",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "green"
       },
       {
         "trait_type": "Eyes",
         "value": "googly"
       },
       {
         "trait_type": "Stamina",
         "value": 42
       }
    ]
  }
  console.log("Uploading buffalo...")
  const parentTokenUri = await ipfs.add(JSON.stringify(buffalo))

  console.log(`Minting buffalo with IPFS hash (${parentTokenUri.path})`)

  let parentTokenId = await testUtils.mintAndGetId(
    composableContract,
    toAddress,
    testConsts.ARTPIECE_TYPE,
    parentTokenUri.path,
    1,
    toAddress
  );

  console.log(`ParentTokenId: ${parentTokenId.toHexString()}`);

  await sleep(delayMS)

  // let parentTokenId = BigNumber.from("0x01540ee3e86f6f97975d24ddc833d1c3fdb594344b6f77ddedf101d205d709");

  // now we mint the Zebra as a child token of the Buffalo
  const zebra = {
    "description": "What is it so worried about?",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/zebra.jpg",
    "name": "Zebra",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "blue"
       },
       {
         "trait_type": "Eyes",
         "value": "googly"
       },
       {
         "trait_type": "Stamina",
         "value": 38
       }
    ]
  }
  console.log("Uploading zebra...")
  const childTokenUri = await ipfs.add(JSON.stringify(zebra))

  console.log(`Minting zebra with IPFS hash (${childTokenUri.path})`)
  let childTokenId = await testUtils.mintAndGetId(
    composableContract,
    composableContract.address,
    testConsts.LAYER_TYPE,
    childTokenUri.path,
    1,
    toAddress,
    parentTokenId
  );

  console.log(`childTokenId: ${childTokenId.toHexString()}`);

  // await sleep(delayMS)

  // console.log("Transferring Ownership of YourCollectible to " + toAddress + "...");

  // await composableContract.transferOwnership(toAddress)

  // await sleep(delayMS)

};

// function mintTestItem()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
