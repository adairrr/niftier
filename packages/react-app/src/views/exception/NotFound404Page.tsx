import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import React from 'react';


class NotFound404Page extends React.Component {
  render() {
    return (
      <Result
        status="404"
        title="404"
        style={{
          background: 'none',
        }}
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    );
  }
}

export default NotFound404Page;
