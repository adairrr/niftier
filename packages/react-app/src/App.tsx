import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import {  JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import './App.css';
import { Row, Col, Button, Layout, Alert, Input, List, Card, Switch as SwitchD } from 'antd';
import { useUserAddress } from 'eth-hooks';
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from './hooks';
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Address, AddressInput, ThemeSwitch } from './components';
import { Transactor } from './helpers';
import { formatEther, parseEther } from '@ethersproject/units';
import { Hints, ExampleUI, Subgraph, Transfers, Mint, UserTokens, TokenView, Token } from './views'
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS } from './constants';
//import Hints from './Hints';
import { RouterMenu } from './RouterMenu';
import WalletConnect, { logoutOfWeb3Modal, web3Modal } from './components/WalletConnect';
import { initiateCeramicWithIDX } from './helpers/ceramic';
import CeramicDocs from './views/CeramicDocs';


/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS['localhost']; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if(DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if(DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);


// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;


function App(props) {

  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  if(DEBUG) console.log("👩‍💼 selected address:", address)

  // You can warn the user if you would like them to be on a specific network
  let localChainId = localProvider && localProvider._network && localProvider._network.chainId
  if(DEBUG) console.log("🏠 localChainId", localChainId)

  let selectedChainId = userProvider && userProvider._network && userProvider._network.chainId
  if(DEBUG) console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId)

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if(DEBUG) console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...")

  // Just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(mainnetProvider, address);
  // if(DEBUG) console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  if(DEBUG) console.log("📝 readContracts", readContracts)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  if(DEBUG) console.log("🔐 writeContracts", writeContracts)

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  // const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)
  // if(DEBUG) console.log("🌍 DAI contract on mainnet:", mainnetDAIContract)
  //
  // Then read your DAI balance like:
  // const myMainnetDAIBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
  // if(DEBUG) console.log("🥇 myMainnetDAIBalance:", myMainnetDAIBalance)


  // keep track of a variable from the contract in the local React state:
  //📟 Listen for broadcast events
  const purpose = useContractReader(readContracts,"YourContract", "purpose")
  if(DEBUG) console.log("🤗 purpose:",purpose)

  //📟 Listen for broadcast events
  const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);
  if(DEBUG) console.log("📟 SetPurpose events:",setPurposeEvents)

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  const loadWeb3Modal = useCallback(async () => {
    console.log("Adair is connecting");
    const provider = await web3Modal.connect();
    console.log("Adair has connected")
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState<string>();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [setRoute]);

  let faucetHint: ReactElement
  const faucetAvailable = localProvider && localProvider.connection && localProvider.connection.url && localProvider.connection.url.indexOf(window.location.hostname)>=0 && !process.env.REACT_APP_PROVIDER && price > 1;

  // const [ faucetClicked, setFaucetClicked ] = useState( false );
  // if(!faucetClicked && localProvider && localProvider._network && localProvider._network.chainId==31337 && yourLocalBalance){
  //   faucetHint = (
  //     <div style={{padding:16}}>
  //       <Button type={"primary"} onClick={()=>{
  //         faucetTx({
  //           to: address,
  //           value: parseEther("0.01"),
  //         });
  //         setFaucetClicked(true)
  //       }}>
  //         💰 Grab funds from the faucet ⛽️
  //       </Button>
  //     </div>
  //   )
  // }

  const account = (
    <div style={{ /*position: "fixed", */textAlign: "right", right: 0, top: 0, padding: 0 }}>
      <Account
        address={address}
        localProvider={localProvider}
        userProvider={userProvider}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        blockExplorer={blockExplorer}
        minimized={false}
      />
    </div>
  );


  return (
    <div className="App">

      <BrowserRouter>
      <Layout className="layout">
        <Header account={account}/>
        {/* {networkDisplay} */}
        <RouterMenu/>
        {faucetHint}
      </Layout>

        <Switch>
          <Route exact path="/">
            <Contract
              name="ComposableOrchestrator"
              signer={userProvider.getSigner()}
              provider={localProvider}
              // address={address}
              blockExplorer={blockExplorer}
              gasPrice={gasPrice}
              price={price}
              customContract={undefined}
              show={undefined}
            />

            { /* Uncomment to display and interact with an external contract (DAI on mainnet):
            <Contract
              name="DAI"
              customContract={mainnetDAIContract}
              signer={userProvider.getSigner()}
              provider={mainnetProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
            */ }
          </Route>
          <Route path="/tokens">
            <UserTokens
              address={address}
              mainnetProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
            />
          </Route>
          <Route path="/transfers">
            <Transfers 
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              readContracts={readContracts}
            />
          </Route>
          <Route path="/composable">
            <Contract
              name="TypedERC1155Composable"
              signer={userProvider.getSigner()}
              provider={localProvider}
              // address={address}
              blockExplorer={blockExplorer}
              gasPrice={gasPrice}
              price={price}
              customContract={undefined}
              show={undefined}
            />
          </Route>
          <Route path="/hints">
            <Hints
              address={address}
              yourLocalBalance={yourLocalBalance}
              mainnetProvider={mainnetProvider}
              price={price}
            />
          </Route>
          <Route path="/exampleui">
            <ExampleUI
              address={address}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              yourLocalBalance={yourLocalBalance}
              price={price}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              purpose={purpose}
              setPurposeEvents={setPurposeEvents}
            />
          </Route>
          <Route path="/subgraph">
            <Subgraph
              subgraphUri={props.subgraphUri}
              tx={tx}
              writeContracts={writeContracts}
              mainnetProvider={mainnetProvider}
            />
          </Route>
          <Route path="/mint">
            <Mint
              address={address}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
            />
          </Route>
          <Route 
            exact path='/token/:tokenId' 
            render={({match}) => (
              <Token 
                address={address}
                tokenId={match['tokenId']}
              />
          )}/>
          <Route path='/ceramic'>
            <CeramicDocs />
          </Route>
          {/* <Route path="/tokenview">
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <TokenView position={[-1.2, 0, 0]} />
              <TokenView position={[1.2, 0, 0]} />
            </Canvas>
          </Route> */}
        </Switch>
      </BrowserRouter>

      <ThemeSwitch />

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
       <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
         <Row align="middle" gutter={[4, 4]}>
           <Col span={8}>
             <Ramp price={price} address={address} networks={NETWORKS}/>
           </Col>

           <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
             <GasGauge gasPrice={gasPrice} />
           </Col>
           <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
             <Button
               onClick={() => {
                 window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
               }}
               size="large"
               shape="round"
             >
               <span style={{ marginRight: 8 }} role="img" aria-label="support">
                 💬
               </span>
               Support
             </Button>
           </Col>
         </Row>

         <Row align="middle" gutter={[4, 4]}>
           <Col span={24}>
             {
               /*  if the local provider has a signer, let's show the faucet:  */
               faucetAvailable ? (
                 <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider}/>
               ) : (
                 ""
               )
             }
           </Col>
         </Row>
       </div>

    </div>
  );
}


// /*
//   Web3 modal helps us "connect" external wallets:
// */
// const web3Modal = new Web3Modal({
//   // network: "mainnet", // optional
//   cacheProvider: true, // optional
//   providerOptions: {
//     walletconnect: {
//       package: WalletConnectProvider, // required
//       options: {
//         infuraId: INFURA_ID,
//       },
//     },
//   },
// });

// const logoutOfWeb3Modal = async () => {
//   await web3Modal.clearCachedProvider();
//   setTimeout(() => {
//     window.location.reload();
//   }, 1);
// };

//  window.ethereum && window.ethereum.on('chainChanged', chainId => {
//   setTimeout(() => {
//     window.location.reload();
//   }, 1);
// })

export default App;
