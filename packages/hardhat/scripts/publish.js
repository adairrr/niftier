const fs = require("fs");
const chalk = require("chalk");
const hre = require("hardhat");

const publishDir = "../react-app/src/contracts";
const graphDir = "../subgraph"

function publishContract(contractNameWithDir) {
  let contractName;
  let contractSubdir = '';
  if (contractNameWithDir.lastIndexOf('/') !== -1) {
    contractName = contractNameWithDir.substr(contractNameWithDir.lastIndexOf('/') + 1);
    contractSubdir = contractNameWithDir.substr(0, contractNameWithDir.lastIndexOf('/') + 1);
    console.log(contractSubdir);
  } else {
    contractName = contractNameWithDir;
  }

  try {
    fs.readFileSync(`${hre.config.paths.artifacts}/${contractName}.address`);
  } catch (error) {
    console.log(chalk.gray(` Skipping ${contractNameWithDir} because it isn't deployed.`));
    return false;
  }

  // console.log(` 💽 Publishing ${chalk.cyan(contractNameWithDir)} to ${chalk.gray(publishDir)}`);
  try {
    let contract = fs
      .readFileSync(`${hre.config.paths.artifacts}/contracts/${contractNameWithDir}.sol/${contractName}.json`)
      .toString();
    
    const address = fs
      .readFileSync(`${hre.config.paths.artifacts}/${contractName}.address`)
      .toString();
    
    contract = JSON.parse(contract);
    
    let graphConfigPath = `${graphDir}/config/config.json`
    let graphConfig
    try {
      if (fs.existsSync(graphConfigPath)) {
        graphConfig = fs
          .readFileSync(graphConfigPath)
          .toString();
      } else {
        graphConfig = '{}'
      }
    } catch (e) {
      console.log(e)
    }

    graphConfig = JSON.parse(graphConfig)
    graphConfig[contractName + "Address"] = address

    // create the subdir
    // if (!fs.existsSync(`${publishDir}/${contractSubdir}`)) {
    //   fs.mkdirSync(`${publishDir}/${contractSubdir}`);
    // }
    fs.writeFileSync(
      `${publishDir}/${contractName}.address.js`,
      `module.exports = "${address}";`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.abi.js`,
      `module.exports = ${JSON.stringify(contract.abi, null, 2)};`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.bytecode.js`,
      `module.exports = "${contract.bytecode}";`
    );

    const folderPath = graphConfigPath.replace("/config.json","")
    if (!fs.existsSync(folderPath)){
      fs.mkdirSync(folderPath);
    }
    fs.writeFileSync(
      graphConfigPath,
      JSON.stringify(graphConfig, null, 2)
    );

    // create the config as a ts file as well
    let tsGraphConfig = '';
    for (let [key, value] of Object.entries(graphConfig)) {
      tsGraphConfig += `export const ${key} = "${value.toLowerCase()}";\n`
    }
    fs.writeFileSync(
      graphConfigPath.replace('.json', '.ts'),
      tsGraphConfig
    );

    // write the abis to subgraph
    fs.writeFileSync(
      `${graphDir}/abis/${contractName}.json`,
      JSON.stringify(contract.abi, null, 2)
    );

    console.log(chalk.green(` 📠 Published ${contractName} to the frontend (${chalk.gray(publishDir)}).`));

    return true;
  } catch (e) {
    if (e.toString().indexOf("no such file or directory") >= 0) {
      console.log(chalk.yellow(` ⚠️  Can't publish ${contractName} yet (make sure it getting deployed).`))
    } else {
      console.log(e);
      return false;
    }
  }
}

function getAllSolFiles(dirPath, solFileList, origLen = 0) {
  solFileList = solFileList || [];

  fs.readdirSync(dirPath).forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      solFileList = getAllSolFiles(
        dirPath + "/" + file, 
        solFileList, 
        origLen === 0 ? dirPath.length + 1 : origLen
      );
    } else if (file.indexOf(".sol") >= 0) {
      if (origLen === 0) {
        solFileList.push(file.replace(".sol", ""));
      } else {
        solFileList.push(dirPath.substr(origLen) + '/' + file.replace(".sol", ""));
      }
    } 
  });
  return solFileList;
}

async function main() {
  if (!fs.existsSync(publishDir)) {
    fs.mkdirSync(publishDir);
  }
  const contractList = getAllSolFiles(hre.config.paths.sources);

  const publishedContractList = contractList.filter(contract => 
    // Add contract to list if publishing is successful
    publishContract(contract)
  );
  
  fs.writeFileSync(
    `${publishDir}/contracts.js`,
    `module.exports = ${JSON.stringify(
      publishedContractList.map(contract => contract.substr(contract.lastIndexOf('/') + 1))
    )};`
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
