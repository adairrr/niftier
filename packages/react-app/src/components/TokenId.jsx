import React from "react";
import Blockies from "react-blockies";
import { Typography, Skeleton } from "antd";

/*
  ~ What it does? ~

  Displays an tokenid with a blockie image and option to copy id

  ~ How can I use? ~

  <TokenId
    tokenId={tokenId}
    fontSize={fontSize}
  />

  ~ Features ~
  - Provide fontSize={fontSize} to change the size of tokenId text
*/

const { Text } = Typography;

export default function TokenId(props) {

  const tokenId = props.value || props.id;  

  if (!tokenId) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  let displayId = tokenId.substr(0, 6);

  displayId = props.size === 'long' ? tokenId : [displayId, tokenId.substr(-4)].join("...");

  if (props.minimized) {
    return (
      <span style={{ verticalAlign: "middle" }}>
        <a /*style={{ color: "#222222" }}*/>
          <Blockies seed={tokenId.toLowerCase()} size={8} scale={2} />
        </a>
      </span>
    );
  }

  let text;
  if (props.onChange) {
    text = (
      <Text editable={{ onChange: props.onChange }} copyable={{ text: tokenId }}>
        <a /*style={{ color: "#222222" }}*/>
          {displayId}
        </a>
      </Text>
    );
  } else {
    text = (
      <Text copyable={{ text: tokenId }}>
        <a /*style={{ color: "#222222" }}*/>
          {displayId}
        </a>
      </Text>
    );
  }

  return (
    <span>
      <span style={{ verticalAlign: "middle" }}>
        <Blockies seed={tokenId.toLowerCase()} size={8} scale={props.fontSize?props.fontSize/7:4} />
      </span>
      <span style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: props.fontSize?props.fontSize:28 }}>{text}</span>
    </span>
  );
}
