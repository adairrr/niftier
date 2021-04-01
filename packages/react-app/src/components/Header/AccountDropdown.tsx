import React, { useState, useContext, FunctionComponent } from 'react';
import * as AntIcon from "@ant-design/icons";
import { Avatar, Menu, Spin } from 'antd';
// import styles from './accountDropdown.less';
import HeaderDropdown from './HeaderDropdown';
import Web3Modal from 'web3modal';
import { useAddressContext } from '../../contexts';
import Blockies from "react-blockies";
import Address from '../Address';

const styles = require('./accountDropdown.less');

type AccountDropdownProps = {
  web3Modal: Web3Modal;
  loadWeb3Modal: () => Promise<void>;
  logoutOfWeb3Modal: () => Promise<void>;
}
const AccountDropdown: FunctionComponent<AccountDropdownProps> = ({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal }) => {

  const currentAddress = useAddressContext();

  const onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;

    console.log(`Just clicked ${key}`);

    switch (key) {
      case 'logout': 
        logoutOfWeb3Modal();
        break;
      case 'connect':
        loadWeb3Modal();
        break;
      case 'settings':

        break;
      case 'profile':

        break;
      default:
        break;
    }
  };

  const currentUser = {
    name: 'Test lol',
    avatar: 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/7_avatar-512.png'
  };
  
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {web3Modal && web3Modal.cachedProvider ? (
        <>
        <Menu.Item key="profile">
          <AntIcon.UserOutlined />
          Profile
        </Menu.Item>
        <Menu.Item key="settings">
          <AntIcon.SettingOutlined />
          Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <AntIcon.LogoutOutlined />
          Logout
        </Menu.Item>
        </>
      ) : (
        <>
        <Menu.Item key="connect">
          <AntIcon.LoginOutlined />
          Connect
        </Menu.Item>
        </>
      )
    }
    </Menu>
  );

  
  
  return web3Modal ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
        {/* <Blockies seed={currentAddress.toLowerCase()} size={8} scale={3} />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span> */}
        <Address uncopyable unlinkable address={currentAddress}/>
      </span>
    </HeaderDropdown>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
}

export default AccountDropdown;
