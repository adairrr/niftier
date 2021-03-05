/* eslint no-use-before-define: "warn" */
import fs from 'fs';
import chalk from 'chalk';
import { config, ethers, upgrades, tenderly, run } from "hardhat";
import { HardhatRuntimeEnvironment } from"hardhat/types";
import { utils, Contract } from "ethers";
import R from "ramda";
import { AccessRestriction, TypedERC1155Composable, ComposableOrchestrator } from "../typechain";

async function main() {

  console.log("\n\n 📡 Deploying...\n");

  const composableTokenName = "ComposableToken";
  const ipfsBaseUri = "ipfs://";

  const [deployer, ...accounts] = await ethers.getSigners();

  const yourContract = await deploy(
    "YourContract", 
    ["aoeu"]
  ); // <-- add in constructor args like line 19

  // deploy accessRestriction
  const accessRestriction = await deploy(
    "AccessRestriction",
    [deployer.address]
  ) as AccessRestriction;

  // deploy the composable token contract
  const composableContract = await deploy(
    "TypedERC1155Composable",
    [accessRestriction.address, composableTokenName, ipfsBaseUri]
  ) as TypedERC1155Composable;

  const composableTypes = [
    utils.formatBytes32String("ARTPIECE_TYPE"),
    utils.formatBytes32String("LAYER_TYPE"),
    utils.formatBytes32String("CONTROLLER_TYPE")
  ];

  // add the artpiece and layer types
  await composableContract.createTokenTypes(composableTypes);

  // get the token Type Ids
  let tokenTypeIds = composableTypes.map(async tokenType => {
    return (await composableContract.tokenTypeNameToId(tokenType)).shl(240);
  });

  // allow artpieces to hold layers 
  await composableContract.authorizeChildType(
    await tokenTypeIds[0],
    await tokenTypeIds[1],
  );

  // allow layers to hold controllers
  await composableContract.authorizeChildType(
    await tokenTypeIds[1],
    await tokenTypeIds[2],
  );

  // deploy the orchestrator
  const orchestrator = await deploy(
    "ComposableOrchestrator",
    [accessRestriction.address, composableContract.address]
  ) as ComposableOrchestrator;

  // TODO add orchestrator role
  await accessRestriction.addMinter(orchestrator.address);
  

  //const secondContract = await deploy("SecondContract")

  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */


  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */


  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.ts#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */


  //If you want to verify your contract on tenderly.co (see setup details in the scaffold-eth README!)
  /*
  await tenderlyVerify(
    {contractName: "YourContract",
     contractAddress: yourContract.address
  })
  */

  // If you want to verify your contract on etherscan
  /*
  console.log(chalk.blue('verifying on etherscan'))
  await run("verify:verify", {
    address: yourContract.address,
    // constructorArguments: args // If your contract has constructor arguments, you can pass them as an array
  })
  */

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

async function deploy(contractName: string, _args = [], overrides = {}, libraries = {}) {
  console.log(` 🛰  Deploying: ${contractName}`);

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(
    contractName, 
    {libraries: libraries}
  );
  console.log(`with Args: \n ${contractArgs}`);
  const deployed = await upgrades.deployProxy(
    contractArtifacts, 
    contractArgs, 
    {unsafeAllowCustomTypes: true}
  );
  await deployed.deployed();

  // const encoded = abiEncodeArgs(deployed, contractArgs);
  fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

  let extraGasInfo = ""
  if (deployed && deployed.deployTransaction) {
    const gasUsed = deployed.deployTransaction.gasLimit.mul(deployed.deployTransaction.gasPrice)
    extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${deployed.deployTransaction.hash}`
  }

  console.log(
    " 📄",
    chalk.cyan(contractName),
    "deployed to:",
    chalk.magenta(deployed.address),
    chalk.grey(extraGasInfo)
  );
  console.log(
    " ⛽",
    chalk.grey(extraGasInfo)
  );

  await tenderly.persistArtifacts({
    name: contractName,
    address: deployed.address
  });

  // if (!encoded || encoded.length <= 2) return deployed;
  // may have to use deployed.interface.encodeFunctionData?
  // fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

  return deployed;
};


// ------ utils -------

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
function abiEncodeArgs(deployed: Contract, contractArgs: any[]) {
  // not writing abi encoded args if this does not pass
  if (
    !contractArgs ||
    !deployed ||
    !R.hasPath(["interface", "deploy"], deployed)
  ) {
    return "";
  }
  const encoded = utils.defaultAbiCoder.encode(
    deployed.interface.deploy.inputs,
    contractArgs
  );
  return encoded;
};

// checks if it is a Solidity file
const isSolidity = (fileName) =>
  fileName.indexOf(".sol") >= 0 && fileName.indexOf(".swp") < 0 && fileName.indexOf(".swap") < 0;

const readArgsFile = (contractName) => {
  let args = [];
  try {
    const argsFile = `./contracts/${contractName}.args`;
    if (!fs.existsSync(argsFile)) return args;
    args = JSON.parse(fs.readFileSync(argsFile).toString());
  } catch (e) {
    console.log(e);
  }
  return args;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// If you want to verify on https://tenderly.co/
const tenderlyVerify = async ({contractName, contractAddress}) => {

  let tenderlyNetworks = ["kovan","goerli","mainnet","rinkeby","ropsten","matic","mumbai","xDai","POA"]
  let targetNetwork = process.env.HARDHAT_NETWORK || config.defaultNetwork

  if(tenderlyNetworks.includes(targetNetwork)) {
    console.log(chalk.blue(` 📁 Attempting tenderly verification of ${contractName} on ${targetNetwork}`))

    await tenderly.persistArtifacts({
      name: contractName,
      address: contractAddress
    });

    let verification = await tenderly.verify({
        name: contractName,
        address: contractAddress,
        network: targetNetwork
      })

    return verification
  } else {
      console.log(chalk.grey(` 🧐 Contract verification not supported on ${targetNetwork}`))
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
