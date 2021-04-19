import React, { useContext } from 'react';
import { Button } from 'antd';
import Web3Modal from 'web3modal';
import Address from './Address';
import Balance from './Balance';
import Wallet from './Wallet';
import { useProviderContext } from '../contexts';

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component, 
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
  />

  ~ Features ~
  
  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

interface AccountProps {
  address: string;
  price: number;
  web3Modal: Web3Modal;
  loadWeb3Modal: () => Promise<void>;
  logoutOfWeb3Modal: () => Promise<void>;
  minimized: boolean;
}

const Account: React.FC<AccountProps> = ({
  address,
  price,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  minimized = false,
}: AccountProps) => {
  const { localProvider, userProvider } = useProviderContext();

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}
        >
          logout
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal}
        >
          connect
        </Button>,
      );
    }
  }

  const display = minimized ? (
    ''
  ) : (
    <span>
      {address ? <Address address={address} /> : 'Connecting...'}
      <Balance address={address} provider={localProvider} price={price} />
      <Wallet address={address} provider={userProvider} price={price} />
    </span>
  );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
};

export default Account;
