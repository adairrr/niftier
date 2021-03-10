# NFT Canvas

[![CircleCI](https://circleci.com/gh/adairrr/nft_canvas.svg?style=svg&circle-token=9d39105416c911725ecbf2098a2999f4e796d52c)](<LINK>)

[![Coverage Status](https://coveralls.io/repos/github/adairrr/nft_canvas/badge.svg?branch=feature/ERC1155Composable&t=ipyeEW)](https://coveralls.io/github/adairrr/nft_canvas?branch=feature/ERC1155Composable)


# 🏗 scaffold-eth

> Mint and display NFTs on Ethereum with a full example app...

---

## 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)


```bash
git clone https://github.com/austintgriffith/scaffold-eth.git simple-nft-example

cd simple-nft-example

git checkout simple-nft-example
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash
cd simple-nft-example
yarn chain

```

> in a third terminal window:

```bash
cd simple-nft-example
yarn deploy

```

---

## 📽 Demo

[![ethdenvervideo](https://user-images.githubusercontent.com/2653167/109873369-e2c58c00-7c2a-11eb-8adf-0ec4b8dcae1e.png)](https://www.youtube.com/watch?t=312&v=33gnKe7ttCc)


---

## 🏃‍♀️ Getting Started

🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment script `deploy.ts` in `packages/hardhat/scripts`

📱 Open http://localhost:3000 to see the app

---

> ✏️ Edit the mint script `mint.js` in `packages/hardhat/scripts` and update the `toAddress` to your frontend address (wallet address in the top right or localhost:3000).

![image](https://user-images.githubusercontent.com/2653167/109536489-03e77a80-7a7b-11eb-8464-4876dc22547c.png)


> in a terminal window run the **mint** script:

```bash

yarn mint

```

![image](https://user-images.githubusercontent.com/2653167/109536688-44df8f00-7a7b-11eb-9382-7205f927c628.png)

👀 You should see your collectibles show up if you minted to the correct address:

![image](https://user-images.githubusercontent.com/2653167/109536827-6c365c00-7a7b-11eb-8482-2a7bb33a1bb5.png)

👛 Open an *incognito* window and navigate to http://localhost:3000 (You'll notice it has a new wallet address).

⛽️ Grab some gas for each account using the faucet:

![image](https://user-images.githubusercontent.com/2653167/109543971-35b10f00-7a84-11eb-832e-36d6b66afbe7.png)

🎟 Send an NFT to the *incognito* window address:

![image](https://user-images.githubusercontent.com/2653167/109536955-925bfc00-7a7b-11eb-855d-bf1523ac524d.png)


<br/>

🕵🏻‍♂️ Inspect the `Debug Contracts` tab to figure out what address is the `owner` of `YourCollectible`?

💼 Edit your deployment script `deploy.js` in `packages/hardhat/scripts`

---

🔏 Edit your smart contract `YourCollectible.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`


🔑 Create wallet links to your app with `yarn wallet` and `yarn fundedwallet`

⬇️ Installing a new package to your frontend? You need to `cd packages/react-app` and then `yarn add PACKAGE`

## 📡 Deploy NFT smart contract!

🛰 Ready to deploy to a testnet?

> Change the `defaultNetwork` in `packages/hardhat/hardhat.config.js`

![image](https://user-images.githubusercontent.com/2653167/109538427-4d38c980-7a7d-11eb-878b-b59b6d316014.png)

🔐 Generate a deploy account with `yarn generate`

![image](https://user-images.githubusercontent.com/2653167/109537873-a2c0a680-7a7c-11eb-95de-729dbf3399a3.png)


👛 View your deployer address using `yarn account` (You'll need to fund this account. Hint: use an [instant wallet](https://instantwallet.io) to fund your account via QR code)

![image](https://user-images.githubusercontent.com/2653167/109537339-ff6f9180-7a7b-11eb-85b0-46cd72311d12.png)

👨‍🎤 Deploy your NFT smart contract:

```bash
yarn deploy
```
---
---

> ✏️ Edit your frontend `App.jsx` in `packages/react-app/src` to change the `targetNetwork` to wherever you deployed your contract:

![image](https://user-images.githubusercontent.com/2653167/109539175-3e9ee200-7a7e-11eb-8d26-3b107a276461.png)

You should see the correct network in the frontend:

![image](https://user-images.githubusercontent.com/2653167/109539305-655d1880-7a7e-11eb-9385-c169645dc2b5.png)

An instant wallet running on xDAI insired by [xdai.io](https://xdai.io).

🎫 Ready to mint a batch of NFTs for reals?

###$ Verifying contracts on Tenderly
scaffold-eth includes the hardhat-tenderly plugin. When deploying to any of the following networks:
```
["kovan","goerli","mainnet","rinkeby","ropsten","matic","mumbai","xDai","POA"]
```
You can verify contracts as part of the `deploy.ts` script. We have created a `tenderlyVerify()` helper function, which takes your contract name and its deployed address:
```
await tenderlyVerify(
  {contractName: "YourContract",
   contractAddress: yourContract.address
})
```
Make sure your target network is present in the hardhat networks config, then either update the default network in `hardhat.config.js` to your network of choice or run:
```
yarn deploy --network NETWORK_OF_CHOICE
```
Once verified, they will then be available to view on Tenderly!

![image](https://user-images.githubusercontent.com/2653167/109539529-a5240000-7a7e-11eb-8d58-6dd7a14e1454.png)


## ⚔️ Side Quests

#### 🐟 Open Sea

> Add your contract to OpenSea ( create -> submit NFTs -> "or add an existing contract" )

(It can take a while before they show up, but here is an example:)

https://testnets.opensea.io/assets/0xc2839329166d3d004aaedb94dde4173651babccf/1

---


#### 🔍 Etherscan Contract Verification

> run `yarn flatten > flat.txt` (You will need to clean up extra junk at the top and bottom of flat.txt. Sorry, rookie stuff here.)

> copy the contents of `flat.txt` to the block explorer and select compiler `v0.6.7` and `Yes` to `Optimization` (200 runs if anyone asks)

![image](https://user-images.githubusercontent.com/2653167/109540618-f84a8280-7a7f-11eb-9a34-c239f1271247.png)

---

## 🌐 Etherscan
Hardhat has a truly wonderful [`hardhat-etherscan` plugin](https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan) that takes care of contract verification after deployment. You need to add the following to your `hardhat.config.js` imports:
```
require("@nomiclabs/hardhat-etherscan");
```
Then add your etherscan API key to the module.exports:
```
etherscan: {
  // Your API key for Etherscan
  // Obtain one at https://etherscan.io/
  apiKey: "YOUR-API-KEY-HERE"
}
```
Verifying is simple, assuming you are verifying a contract that you have just deployed from your hardhat setup - you just need to run the verify script, passing constructor arguments as an array if necessary (there is an example commented out in the `deploy.ts`):
```
await run("verify:verify", {
  address: yourContract.address,
  // constructorArguments: args // If your contract has constructor arguments, you can pass them as an array
})
```
You only have to pass the contract because the plugin figures out which of the locally compiled contracts is the right one to verify. Pretty cool stuff!

> You will need to get a key from [infura.io](https://infura.io) and paste it into `constants.js` in `packages/react-app/src`:

![image](https://user-images.githubusercontent.com/2653167/109541146-b5d57580-7a80-11eb-9f9e-04ea33f5f45a.png)

---

## 🛳 Ship the app!

> ⚙️ build and upload your frontend and share the url with your friends...

```bash

# build it:

yarn build

# upload it:

yarn surge

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA)  to ask questions and find others building with 🏗 scaffold-eth!

yarn s3

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

yarn ipfs
```

![image](https://user-images.githubusercontent.com/2653167/109540985-7575f780-7a80-11eb-9ebd-39079cc2eb55.png)

> 👩‍❤️‍👨 Share your public url with a friend and ask them for their address to send them a collectible :)

![transfernft2](https://user-images.githubusercontent.com/2653167/109542105-df42d100-7a81-11eb-9e3a-7cc1f1ee0fb7.gif)
