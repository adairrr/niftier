import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import React from 'react';

class ServerError500Page extends React.PureComponent {
  render() {
    return (
      <Result
        status="500"
        title="500"
        style={{
          background: 'none',
        }}
        subTitle="Sorry, the server is reporting an error."
        extra={
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    );
  }
}

export default ServerError500Page;
