import React, { FunctionComponent, useState } from 'react';
import { Form, Card, Typography, Input, Tooltip, Row, Col, Upload, Switch, Select } from 'antd';
import { CheckOutlined, CloseOutlined, FileAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { SingleFileDropzone } from './Files/SingleFileDropzone';
import PinataDraggableDropzone from './Files/PinataDraggableDropzone';
const { TextArea } = Input;
const { Dragger } = Upload;
const { Text } = Typography;
const { Option } = Select;

type LayerCardProps = {
    name?: string;
    address: string;
}

const LayerCard: FunctionComponent<LayerCardProps> = ({ name, address }) => {

  const [ tokenRecipient, setTokenRecipient ] = useState(address);

  const onSelectRecipient = (recipient: string) => {
    setTokenRecipient(recipient);
  }
  
  const onSuccessfulUpload = () => {
    
  }

  
  return (
    <Card>
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
        <Row gutter={8}>
          <Col span={18}>
            <Form.Item name={['user', 'introduction']} label="Layer name">
              <Input
                placeholder='Have fun with it!'
                suffix={
                  <Tooltip title="Extra information">// TODO this needs to take dark mode into account
                    
                    <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
              />
            </Form.Item>
            <Form.Item name={['aoeu', 'oeuioeui']} label="Layer description">
              <TextArea 
                rows={4}
                autoSize
                placeholder='What is this layer all about?'
            />
            </Form.Item>
            <Form.Item
              // name="recipient"
              label="Mint recipient"
            >
              <Input.Group compact style={{ textAlign: 'left', width: '100%' }}
>
                <Form.Item 
                  // style={{ float: 'left' }}
                  name={['recipient', 'select']} 
                  // noStyle 
                  rules={[{ required: true, message: 'Recipient is required' }]}
                >
                  <Select defaultValue={address} placeholder="Please select a recipient" onChange={onSelectRecipient}>
                    <Option value={address}>Self</Option>
                    <Option value="user">User</Option>
                    <Option value="token">Token</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item 
                  name={['recipient', 'address']}
                  // style={{ float: 'left' }}
                  // style={{ display: "inline-block"}}
                  rules={[{ required: true, message: 'Recipient is required' }]}
                >
                  <Input 
                    allowClear 
                    disabled={tokenRecipient === address} 
                    defaultValue={address} 
                    placeholder={tokenRecipient !== 'user' ? address : 'address'}
                    style={{ textAlign: 'left', width: '100%' }}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item label='Show JSON'>
              <Switch
                style={{ float: 'left' }}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <PinataDraggableDropzone singleFile={true}/>
          </Col>
        </Row>
      </Form>
    </Card>
  );
  
}

export default LayerCard;
