import { Menu } from "antd";
import React, {  useEffect, useState } from "react";
import { Link } from "react-router-dom";


export function RouterMenu() {
  const [route, setRoute] = useState<string>();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [setRoute]);

  return (
    <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
      <Menu.Item key="/">
        <Link onClick={()=>{setRoute("/")}} to="/">ComposableOrchestrator</Link>
      </Menu.Item>
      <Menu.Item key="/composable">
        <Link onClick={()=>{setRoute("/composable")}} to="/composable">ERC1155Composable</Link>
      </Menu.Item>
      <Menu.Item key="/tokens">
        <Link onClick={()=>{setRoute("/tokens")}} to="/tokens">Tokens</Link>
      </Menu.Item>
      <Menu.Item key="/transfers">
        <Link onClick={()=>{setRoute("/transfers")}} to="/transfers">Transfers</Link>
      </Menu.Item>
      <Menu.Item key="/hints">
        <Link onClick={()=>{setRoute("/hints")}} to="/hints">Hints</Link>
      </Menu.Item>
      <Menu.Item key="/exampleui">
        <Link onClick={()=>{setRoute("/exampleui")}} to="/exampleui">ExampleUI</Link>
      </Menu.Item>
      <Menu.Item key="/subgraph">
        <Link onClick={()=>{setRoute("/subgraph")}} to="/subgraph">Subgraph</Link>
      </Menu.Item>
      <Menu.Item key="/mint">
        <Link onClick={()=>{setRoute("/mint")}} to="/mint">Mint</Link>
      </Menu.Item>
      <Menu.Item key="/tokenview">
        <Link onClick={()=>{setRoute("/tokenview")}} to="/tokenview">view</Link>
      </Menu.Item>
    </Menu>
  );
}

 