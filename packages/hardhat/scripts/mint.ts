/* eslint no-use-before-define: "warn" */
import fs from "fs";
import chalk from "chalk";
import { config, ethers } from "hardhat";
import { utils } from "ethers";
import { TypedERC1155Composable } from "../typechain";
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
  const uploaded = await ipfs.add(JSON.stringify(buffalo))

  console.log(`Minting buffalo with IPFS hash (${uploaded.path})`)

  await composableContract.mint(
    toAddress,
    utils.formatBytes32String("ARTPIECE_TYPE"),
    uploaded.path,
    1,
    toAddress,
    utils.toUtf8Bytes(''),
    {gasLimit:400000}
  )


  await sleep(delayMS)


  // const zebra = {
  //   "description": "What is it so worried about?",
  //   "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
  //   "image": "https://austingriffith.com/images/paintings/zebra.jpg",
  //   "name": "Zebra",
  //   "attributes": [
  //      {
  //        "trait_type": "BackgroundColor",
  //        "value": "blue"
  //      },
  //      {
  //        "trait_type": "Eyes",
  //        "value": "googly"
  //      },
  //      {
  //        "trait_type": "Stamina",
  //        "value": 38
  //      }
  //   ]
  // }
  // console.log("Uploading zebra...")
  // const uploadedzebra = await ipfs.add(JSON.stringify(zebra))

  // console.log(`Minting zebra with IPFS hash (${uploadedzebra.path})`)
  // await composableContract.mintItem(toAddress, uploadedzebra.path, {gasLimit:400000})

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
