import React from "react";
import { PageHeader } from "antd";
import WalletConnect from "./WalletConnect";
import AccountDropdown from "./Header/AccountDropdown";

// displays a page header

interface HeaderProps {
  account: JSX.Element;
}

export default function Header({ account }: HeaderProps) {
  return (
    <>
      <PageHeader
        title="🖼 NFT Canvas"
        subTitle="Collaborative, programmable art"
        style={{ cursor: "pointer" }}
        extra={
          <>{account}</>}
      >
        {/* {account} */}
      </PageHeader>
    </>
  );
}
