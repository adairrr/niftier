import React from "react";
import Blockies from "react-blockies";
import { Typography, Skeleton } from "antd";
import { useLookupAddress } from "../hooks";
import { useBlockExplorerContext, useProviderContext } from "../contexts";

// changed value={address} to address={address}

/*
  ~ What it does? ~

  Displays an address with a blockie image and option to copy address

  ~ How can I use? ~

  <Address
    address={address}
    blockExplorer={blockExplorer}
    fontSize={fontSize}
  />

  ~ Features ~

  - Your address will be replaced by ENS name (ex. "0xa870" => "user.eth")
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide fontSize={fontSize} to change the size of address text
*/

const { Text } = Typography;

const blockExplorerLink = (address, blockExplorer) => `${blockExplorer || "https://etherscan.io/"}${"address/"}${address}`;

export default function Address(props) {

  const { blockExplorer } = useBlockExplorerContext();
  const { mainnetProvider } = useProviderContext();

  const address = props.value || props.address;

  const ens = useLookupAddress(mainnetProvider, address);
  const etherscanLink = blockExplorerLink(address, blockExplorer);

  const copyableProps = props.uncopyable ? {} : { copyable: { text: address } };

  const etherscanLinkProps = props.unlinkable ? {} : { target: "_blank", href: {etherscanLink}, rel: "noopener noreferrer" };

  if (!address) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  let displayAddress = address.substr(0, 6);

  if (ens && ens.indexOf("0x")<0) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + address.substr(-4);
  } else if (props.size === "long") {
    displayAddress = address;
  }

  if (props.minimized) {
    return (
      <span style={{ verticalAlign: "middle" }}>
        <a /*style={{ color: "#222222" }}*/ {...etherscanLinkProps}>
          <Blockies seed={address.toLowerCase()} size={8} scale={2} />
        </a>
      </span>
    );
  }

  let text;
  if (props.onChange) {
    text = (
      <Text editable={{ onChange: props.onChange }} {...copyableProps}>
        <a /*style={{ color: "#222222" }}*/ {...etherscanLinkProps}>
          {displayAddress}
        </a>
      </Text>
    );
  } else {
    text = (
      <Text {...copyableProps}>
        <a /*style={{ color: "#222222" }}*/ {...etherscanLinkProps}>
          {displayAddress}
        </a>
      </Text>
    );
  }

  return (
    <span>
      <span style={{ verticalAlign: "middle" }}>
        <Blockies seed={address.toLowerCase()} size={8} scale={props.fontSize ? props.fontSize / 7 : 4} />
      </span>
      <span style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: props.fontSize ? props.fontSize : 28 }}>{text}</span>
    </span>
  );
}
