import WalletConnectProvider from '@walletconnect/web3-provider';
import { Alert } from 'antd';
import React, { useEffect, ReactElement, useCallback, useState, useContext } from 'react';
import { INFURA_ID, NETWORK, NETWORKS } from '../constants';
import Web3Modal from 'web3modal';
import { Web3Provider } from '@ethersproject/providers';

const targetNetwork = NETWORKS['localhost']; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

/*
  Web3 modal helps us "connect" external wallets:
*/
export const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
  theme: 'dark'
});

// TODO this doesn't work -_-
export const updateWeb3ModalTheme = async (theme: string) => {
  await web3Modal.updateTheme(theme);
}

export const logoutOfWeb3Modal = async () => {
  web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

 window.ethereum && window.ethereum.on('chainChanged', chainId => {
  setTimeout(() => {
    window.location.reload();
  }, 1);
})

interface WalletConnectProps {
  localChainId: number;
  selectedChainId: any;
}

const WalletConnect = ({ localChainId, selectedChainId }: WalletConnectProps) => {

  const [ networkDisplay, setNetworkDisplay ] = useState<ReactElement>();

  useEffect(() => {
    let display: ReactElement;
    if (localChainId && selectedChainId && localChainId != selectedChainId ) {
      display = (
        <div style={{zIndex:2, position:'absolute', right:0,top:60,padding:16}}>
          <Alert
            message={"⚠️ Wrong Network"}
            description={(
              <div>
                You have <b>{NETWORK(selectedChainId).name}</b> selected and you need to be on <b>{NETWORK(localChainId).name}</b>.
              </div>
            )}
            type="error"
            closable={false}
          />
        </div>
      )
    } else {
      display = (
        <div style={{zIndex:-1, position:'absolute', right:154, top:28, padding:16, color:targetNetwork.color}}>
          {targetNetwork.name}
        </div>
      )
    }
    setNetworkDisplay(display);
  }, [localChainId, selectedChainId]);

  

  return(<>{networkDisplay}</>);
}


export default WalletConnect;
