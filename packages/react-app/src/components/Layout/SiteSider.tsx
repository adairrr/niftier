import React, { useRef, useState } from "react";
import { PageHeader, Layout, Menu, MenuTheme } from "antd";
import WalletConnect from "../WalletConnect";
import AccountDropdown from "../Header/AccountDropdown";
import windowSize from 'react-window-size';
import useThemeContext from '../../contexts/ThemeContext';
import { NavLink, useLocation } from "react-router-dom";
import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { SiderTheme } from "antd/lib/layout/Sider";
import './SiteSider.less';
import { relative } from "node:path";
const { SubMenu } = Menu;

// displays a page header

interface SiteSiderProps {
}

const SiteSider: React.FC<SiteSiderProps> = ({  }) => {

  const baseClassName = 'SiteSider';
  const { theme } = useThemeContext();

  const [ collapsed, setCollapsed ] = useState(false);
  const [ isMobileMenu, setIsMobileMenu ] = useState(false);

  const renderLogoAndTitle = (
    <a>
      <img 
        src={'https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg'} 
        alt="logo" 
      />
      {collapsed ? null : <h1>Test test test</h1>}
    </a>
  );
  


  return (
    <div className={`${baseClassName}`}>
      <Layout.Sider 
        width={208}
        collapsible
        collapsed={collapsed} 
        collapsedWidth={48}// TODO smaller
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        theme={theme as SiderTheme}
        className={`${baseClassName}-sider`}
      >
        <div
          className={`${baseClassName}-logo`}
          // onClick={onMenuHeaderClick}
          id="logo"
        >
          {renderLogoAndTitle}
        </div>
        <div className={`${baseClassName}-menu-links`}>
          <Menu 
            theme={theme as MenuTheme}
            defaultSelectedKeys={['1']}
            mode="inline"
            inlineIndent={16}
          >
            {/* TODO should put these in a list of sorts*/}
            
            <Menu.Item key="1" icon={<PieChartOutlined />} >
              Option 1
            </Menu.Item>
            {!collapsed ? 
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              <NavLink to="/tokens" className="nav-text">
                Tokens
              </NavLink>
            </Menu.Item> :
            <SubMenu key="sub3" icon={<DesktopOutlined />} title="aoeu">
              <Menu.Item key="3">
                <NavLink to="/tokens" className="nav-text">
                  Tokens
                </NavLink>
              </Menu.Item>
              
            </SubMenu>
            }
            {/* <Menu.Item key="2" icon={<DesktopOutlined />}>
              <NavLink to="/tokens" className="nav-text">
                Tokens
              </NavLink>
            </Menu.Item> */}

            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />}>
              <NavLink to="/mint" className="nav-text">
                Mint
              </NavLink>
            </Menu.Item>
          </Menu>
        </div>
      </Layout.Sider>
    </div>
  );
}

export default SiteSider;

/*
      <PageHeader
        title="🖼 NFT Canvas"
        subTitle="Collaborative, programmable art"
        style={{ cursor: "pointer" }}
        extra={
          <>{account}</>}
      >
        // </PageHeader>
*/
