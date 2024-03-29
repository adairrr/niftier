import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import React from 'react';

class Unauthorized403Page extends React.PureComponent {
  render() {
    return (
      <Result
        status="403"
        title="403"
        style={{
          background: 'none',
        }}
        subTitle="Sorry, you don't have access to this page."
        extra={
          <Link to="/">
            <Button type="primary">Back to home</Button>
          </Link>
        }
      />
    );
  }
}

export default Unauthorized403Page;
