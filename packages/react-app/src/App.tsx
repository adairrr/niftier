import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import {  JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import './App.css';
import { Layout } from 'antd';
import { useUserAddress } from 'eth-hooks';
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from './hooks';
import { Account, Faucet, Ramp, Contract, GasGauge, ThemeSwitch } from './components';
import { Transactor } from './helpers';
import { formatEther, parseEther } from '@ethersproject/units';
import { Hints, ExampleUI, Subgraph, Transfers, Mint, UserTokens } from './views'
import { Token } from './components/Tokens';
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS } from './constants';
//import Hints from './Hints';
import { RouterMenu } from './RouterMenu';
import { logoutOfWeb3Modal, web3Modal } from './components/WalletConnect';
import CeramicDocs from './views/CeramicDocs';
import Landing from './components/Landing';
import Footer from './components/Landing/Footer1';
import './components/Landing/less/antMotionStyle.less';
import { CeramicAuthProvider } from './contexts';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { SiteHeader, SiteSider } from './components/Layout';

import {
  Footer11DataSource,
} from './components/Landing/data.source';
import AccountDropdown from './components/Header/AccountDropdown';
import { NotFound404Page } from './views/exception';
import EthContextProvider from './contexts/EthContextProvider';
import { EthereumAuthProvider, ThreeIdConnect } from '3id-connect';
import { DIDProvider } from 'dids'


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

// const threeID = new ThreeIdConnect();

function App(props) {

  const [ injectedProvider, setInjectedProvider ] = useState<Web3Provider>();
  const [ authProvider, setAuthProvider ] = useState<EthereumAuthProvider>();
  const [ didProvider, setDidProvider ] = useState<DIDProvider>();

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);

  const providers = {
    userProvider: userProvider,
    localProvider: localProvider,
    mainnetProvider: mainnetProvider
  }

  const address = useUserAddress(userProvider);

  const [ currentAddress, setCurrentAddress ] = useState<string>(address);

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
  const readContracts = useContractLoader(localProvider);
  if(DEBUG) console.log("📝 readContracts", readContracts);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider);
  if(DEBUG) console.log("🔐 writeContracts", writeContracts);

  const contractsIo = {
    tx: tx,
    reader: readContracts,
    writer: writeContracts
  };


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
  if (DEBUG) console.log("🤗 purpose:",purpose)

  //📟 Listen for broadcast events
  const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);
  if (DEBUG) console.log("📟 SetPurpose events:",setPurposeEvents)

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  const loadWeb3Modal = useCallback(async () => {
    if (DEBUG) console.log("User is connecting to web3");
    try {
      const provider = await web3Modal.connect();

      if (DEBUG) console.log("User has connected to web3")
      console.log(provider)
      setInjectedProvider(new Web3Provider(provider));
      // const ethAuthProv = new EthereumAuthProvider(provider, addresses[0]);
      // setAuthProvider(ethAuthProv);
      // console.log(ethAuthProv);
      // console.log(threeID);
      // await threeID.connect(ethAuthProv);

      // const didProv = threeID.getDidProvider();
      // console.log("GOT HERE:", didProv);
      // setDidProvider(didProv as DIDProvider);
    } catch (e) { 
      // catches 'Modal closed by user'
      if (DEBUG) console.log(e);
    };
    
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      console.log("Loading web3 model");
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  // update address when it changes
  useEffect(() => {
    setCurrentAddress(address);
  }, [address]);

  const [route, setRoute] = useState<string>();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [setRoute]);

  let faucetHint: ReactElement
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name === "localhost";
  
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
        address={currentAddress}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        minimized={false}
      />
    </div>
  );

/*
  const authenticate = async (): Promise<string> => {

    const ceramicPromise = createCeramic();


    const [ceramic] = await Promise.all([ceramicPromise]);
    console.log('ceramic', ceramic)
    console.log('provider', didProvider)


    const did = new DID({
      provider: didProvider,
      //@ts-ignore
      resolver: ThreeIdResolver.getResolver(ceramic),
    });
    console.log(did);
    const promise = did.authenticate();

    // const promise = ceramic.setDIDProvider(didProvider);
    console.log("Got promise", promise);
    console.log("now awaiting promise");
    const resp = await promise;
    console.log("Got respones", resp);

    const idx = createIDX(ceramic);
    console.log('idx', idx);
    
    console.log(ceramic.did);
    // window.did = ceramic.did;
    return idx.id;
  }
*/
  const accountDropdown = (
    <AccountDropdown
      web3Modal={web3Modal}
      loadWeb3Modal={loadWeb3Modal}
      logoutOfWeb3Modal={logoutOfWeb3Modal}
    />
  );

  return (
    <div className="App">
      <CeramicAuthProvider>
      <EthContextProvider 
        currentAddress={currentAddress} 
        contractsIo={contractsIo}
        providers={providers}
        blockExplorer={blockExplorer}
      >
      <ThemeContextProvider>

      <BrowserRouter>
        <Layout className="layout" style={{ minHeight: '100vh' }}>
          <SiteSider />
          {/* {networkDisplay} */}
          {/* <RouterMenu/> */}
          
          <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <SiteHeader account={accountDropdown}/>
            <ThemeSwitch web3Modal={web3Modal}/>
            <Layout.Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
              {/* <Button onClick={authenticate}>
                CLICK HERE TO AUTHENTICATE
              </Button> */}


              {faucetHint}
              <Switch>
                <Route exact path="/" >
                  <Landing />
                </Route>

                <Route exact path="/orchestrator">
                  <Contract
                    name="ComposableOrchestrator"
                    signer={userProvider.getSigner()}
                    provider={localProvider}
                    gasPrice={gasPrice}
                    price={price}
                    customContract={undefined}
                    show={undefined}
                  />
                </Route>
                <Route path="/tokens">
                  <UserTokens />
                </Route>
                <Route path="/transfers">
                  <Transfers />
                </Route>
                <Route path="/composable">
                  <Contract
                    name="TypedERC1155Composable"
                    signer={userProvider.getSigner()}
                    provider={localProvider}
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
                    price={price}
                  />
                </Route>
                <Route path="/exampleui">
                  <ExampleUI
                    address={address}
                    yourLocalBalance={yourLocalBalance}
                    price={price}
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
                  <Mint />
                </Route>
                <Route 
                  exact path='/token/:tokenId' 
                  render={({match}) => (
                    <Token 
                      tokenId={match['tokenId']}
                    />
                )}/>
                <Route path='/ceramic'>
                  <CeramicDocs />
                </Route>
                <Route path="*" component={NotFound404Page} /> 
              </Switch>
            </Layout.Content>

            <Layout.Footer>
              {/* <Footer 
                id="Footer1_1"
                key="Footer1_1"
                dataSource={Footer11DataSource}
                isMobile={false}
              /> */}
            </Layout.Footer>
          </Layout>
        </Layout>
      </BrowserRouter>

      
      

            {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      {/* <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
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
              //  if the local provider has a signer, let's show the faucet:
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price}/>
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div> */}
      </ThemeContextProvider>
      </EthContextProvider>
      </CeramicAuthProvider>
    </div>
  );
}

export default App;
