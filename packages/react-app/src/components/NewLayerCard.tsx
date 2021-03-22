import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Form, Card, Typography, Input, Tooltip, Row, Col, Upload, Switch, Select } from 'antd';
import { CheckOutlined, CloseOutlined, FileAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { SingleFileDropzone } from './Files/SingleFileDropzone';
import PinataDraggableDropzone from './Files/PinataDraggableDropzone';
const { TextArea } = Input;
const { Dragger } = Upload;
const { Text } = Typography;
const { Option } = Select;

// interface FieldData {
//   name: string | number | (string | number)[];
//   value?: any;
//   touched?: boolean;
//   validating?: boolean;
//   errors?: string[];
// }

type LayerCardProps = {
    name?: string;
    address: string;
}

const LayerCard: FunctionComponent<LayerCardProps> = ({ name, address }) => {

  const [ tokenRecipient, setTokenRecipient ] = useState('self');

  const onSelectRecipient = (recipient: string) => {
    setTokenRecipient(recipient);
  }

  const onFormValuesChange = (changedValues, allValues) => {
    console.log(changedValues);
    console.log(allValues);
  }

  
  return (
    <Card>
      <Form 
        labelCol={{ span: 4 }} 
        wrapperCol={{ span: 16 }}
        onValuesChange={onFormValuesChange}
      >
        <Row gutter={8}>
          <Col span={18}>
            <Form.Item name={['user', 'introduction']} label="Layer name">
              <Input
                placeholder='Have fun with it!'
                // TODO this needs to take dark mode into account
                suffix={
                  <Tooltip title="Extra information">
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
                  style={{ width: '17%' }}
                  rules={[{ required: true, message: 'Recipient is required' }]}
                >
                  <Select 
                    defaultValue='self' 
                    placeholder="Please select a recipient" 
                    onChange={onSelectRecipient}
                  >
                    <Option value="self">Self</Option>
                    <Option value="user">User</Option>
                    <Option value="token">Token</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item 
                  name={['recipient', 'address']}
                  // style={{ float: 'left' }}
                  // style={{ display: "inline-block"}}
                  style={{ width: '83%' }}
                  rules={[{ 
                    type: 'string', 
                    len: 42,
                    required: true, 
                    message: 'Recipient address does not match length constrant \'42\'' 
                  }]}
                >
                  <Input 
                    allowClear 
                    disabled={tokenRecipient === 'self'}
                    defaultValue={address} 
                    placeholder={tokenRecipient === 'self' ? address : 'address'}
                    style={{ textAlign: 'left', width: '100%' }}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            {/* <Form.Item label='Show JSON'>
              <Switch
                style={{ float: 'left' }}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item> */}
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
