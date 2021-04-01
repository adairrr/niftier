import React, { useRef, useState } from "react";
import { PageHeader, Layout, Menu, MenuTheme } from "antd";
import WalletConnect from "../WalletConnect";
import AccountDropdown from "../Header/AccountDropdown";
import useThemeContext from '../../contexts/ThemeContext';
import { NavLink, useLocation, useRouteMatch } from "react-router-dom";
import * as AntIcon from "@ant-design/icons";
import { SiderTheme } from "antd/lib/layout/Sider";
import './SiteSider.less';
import { relative } from "node:path";
const { SubMenu } = Menu;

const paths = [
  {
    path: `/`,
    title: 'Home',
    icon: <AntIcon.HomeOutlined/>
  },
  {
    path: `/tokens`,
    title: 'Tokens',
    icon: <AntIcon.PictureOutlined/>
  },
  {
    path: `/mint`,
    title: 'Mint',
    icon: <AntIcon.FormOutlined/>
  }
];

const adminPaths = [
  {
    path: `/Composable`,
    title: 'Mint',
    icon: <AntIcon.CodeOutlined/>
  },
  {
    path: `/orchestrator`,
    title: 'Orchestrator',
    icon: <AntIcon.CodeOutlined/>
  },
  {
    path: `/transfers`,
    title: 'Transfers',
    icon: <AntIcon.ArrowsAltOutlined/>
  },
  {
    path: `/subgraph`,
    title: 'Subgraph',
    icon: <AntIcon.RadarChartOutlined/>
  },
];
interface SiteSiderProps {
}

const SiteSider: React.FC<SiteSiderProps> = ({  }) => {

  const baseClassName = 'SiteSider';
  const { theme } = useThemeContext();
  const { path } = useRouteMatch();
  let location = useLocation(); 

  const [ collapsed, setCollapsed ] = useState(false);
  const [ isMobileMenu, setIsMobileMenu ] = useState(false);

  const renderLogoAndTitle = (
    <a>
      <img 
        src={'https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg'} 
        alt="logo" 
      />
      {collapsed ? null : <h1>Imaginifty</h1>}
    </a>
  );

  
  const mapRoutesToMenuItem = (routes) => {
    return routes.slice().map((route) => { 
      return (
        <Menu.Item key={route.path} icon={route.icon}>
          <NavLink to={route.path} className="nav-text">{route.title}</NavLink>
        </Menu.Item>
      );
    });
  }


  return (
    <div className={`${baseClassName}`}>
      <Layout.Sider 
        width={208}
        collapsible
        collapsed={collapsed} 
        collapsedWidth={48}// TODO smaller
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        trigger={collapsed ? <AntIcon.MenuUnfoldOutlined /> : <AntIcon.MenuFoldOutlined />}
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
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
            inlineIndent={16}
          >
            {mapRoutesToMenuItem(paths)}

            <Menu.SubMenu key="adminPaths" icon={<AntIcon.DesktopOutlined />} title="Admin">
              {mapRoutesToMenuItem(adminPaths)}
            </Menu.SubMenu>
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
