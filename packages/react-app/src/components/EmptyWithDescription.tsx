import { Empty } from 'antd';
import React, { Component } from 'react';

type EmptyProps = {
  height?: number;
  description?: string;
  imageUrl?: string;
};
// IMAGES
export default class EmptyWithDescription extends Component<EmptyProps> {
  static defaultProps = {
    height: 100,
    description: 'No data',
    imageUrl: 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg',
  };

  public render() {
    return (
      <Empty
        image={this.props.imageUrl}
        imageStyle={{
          height: this.props.height,
        }}
        style={{ padding: 10 }}
        description={<span>{this.props.description}</span>}
      >
        {this.props.children}
      </Empty>
    );
  }
}
