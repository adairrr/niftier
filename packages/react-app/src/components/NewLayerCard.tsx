import React, { ChangeEvent, FunctionComponent, useState } from 'react';
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
    onFormValuesChange: (formId: string, changedValues: any, allValues: any) => void;
}

const LayerCard: FunctionComponent<LayerCardProps> = ({ name, address, onFormValuesChange: extOnValuesChange }) => {

  const [ tokenRecipient, setTokenRecipient ] = useState('self');

  const onSelectRecipient = (recipient: string) => {
    setTokenRecipient(recipient);
  }

  const onFormValuesChange = (changedValues, allValues) => extOnValuesChange(name, changedValues, allValues);

  
  return (
    <Card>
      <Form 
        name={name ? name : ''}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        onValuesChange={onFormValuesChange}
      >
        <Row gutter={4}>
          <Col span={16}>
            <Form.Item name={['name']} label="Name">
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
            <Form.Item name={['description']} label="Description">
              <TextArea 
                rows={4}
                autoSize
                placeholder='What is this layer all about?'
            />
            </Form.Item>
            <Form.Item
              // name="recipient"
              label="Recipient"
            >
              <Input.Group compact style={{ textAlign: 'left', width: '100%' }}
>
                <Form.Item 
                  // style={{ float: 'left' }}
                  name={['recipient', 'select']} 
                  // noStyle 
                  initialValue='self'
                  style={{ width: '17%' }}
                  rules={[{ required: true, message: 'Recipient is required' }]}
                >
                  <Select 
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
                  initialValue={address}
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
            </Form.Item> valuePropName="uploadedFileUrl" getValueFromEvent={normFile}*/}
          </Col>
          <Col span={8}>
            <Form.Item 
              name={['image']}
              valuePropName='onChange'
              getValueFromEvent={(e) => e.fileUrlPreview } 
              noStyle
            >
              <PinataDraggableDropzone singleFile={true}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
  
}

export default LayerCard;
