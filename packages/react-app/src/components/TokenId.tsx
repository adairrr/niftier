/* eslint-disable jsx-a11y/anchor-is-valid */ // TODO TODO
import React, { Component } from 'react';
import Blockies from 'react-blockies';
import { Typography, Skeleton } from 'antd';
import { Link } from 'react-router-dom';

const { Text } = Typography;

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

type TokenIdProps = {
  id: string;
  fontSize: number;
  minimized: boolean;
  size: string;
  onChange?: () => void;
};
class TokenId extends React.PureComponent<TokenIdProps> {
  static defaultProps = {
    fontSize: 16,
    minimized: false,
    size: 'short',
  };

  public render() {
    const tokenId = this.props.id;

    if (!tokenId) {
      return (
        <span>
          <Skeleton avatar paragraph={{ rows: 1 }} />
        </span>
      );
    }

    let displayId = tokenId.substr(0, 6);

    displayId = this.props.size === 'long' ? tokenId : [displayId, tokenId.substr(-4)].join('...');

    if (this.props.minimized) {
      return (
        <span style={{ verticalAlign: 'middle' }}>
          <a /* style={{ color: "#222222" }} */>
            <Blockies seed={tokenId.toLowerCase()} size={8} scale={2} />
          </a>
        </span>
      );
    }

    let text;
    if (this.props.onChange) {
      text = (
        <Text editable={{ onChange: this.props.onChange }} copyable>
          <a /* style={{ color: "#222222" }} */>{displayId}</a>
        </Text>
      );
    } else {
      text = (
        <Link to={`/token/${tokenId}`} component={Typography.Link}>
          <Text copyable={{ text: tokenId }}>
            <>{displayId}</>
          </Text>
        </Link>
      );
    }

    return (
      <span>
        <span style={{ verticalAlign: 'middle' }}>
          <Blockies seed={tokenId.toLowerCase()} size={8} scale={this.props.fontSize ? this.props.fontSize / 7 : 4} />
        </span>
        <span
          style={{ verticalAlign: 'middle', paddingLeft: 5, fontSize: this.props.fontSize ? this.props.fontSize : 28 }}
        >
          {text}
        </span>
      </span>
    );
  }
}

export default TokenId;
