import React, { useContext, useState } from 'react';
import MintableLayerStore from '../../store/MintableLayerStore';
import { observer } from 'mobx-react-lite';
import { Form, Card, Input, Tooltip, Row, Col, Select, Switch } from 'antd';
import * as AntIcon from "@ant-design/icons";
import { useAddressContext } from '../../contexts';
import PinataDraggableDropzone from '../Files/PinataDraggableDropzone';
import { PinataResponse } from '../../helpers/pinata';
const { Option } = Select;
const { TextArea } = Input;

interface MintableLayerFormProps {
  layer: MintableLayerStore;
}

const MintableLayerForm: React.FC<MintableLayerFormProps> = ({ layer }) => {

  const currentAddress = useAddressContext();

  const [ tokenRecipient, setTokenRecipient ] = useState('self');

  // TODO use this instead of onFormValuesChange garbage
  const updateLayerProperty = (key: string, value: string) => {
    layer[key] = value
  }

  const onFormValuesChange = (changedValues, allValues) => {
    // console.log(changedValues);
    if (changedValues.name) layer.setName(changedValues.name);
    if (changedValues.description) layer.setDescription(changedValues.description);
    if (changedValues.recipient && changedValues.recipient.address) layer.setRecipientAddress(changedValues.recipient.address);
    if (changedValues.image) layer.setMediaPrevew(changedValues.image);
  };

  const handleSuccessfulUpload = (uploadResponse: PinataResponse) => {
    console.log("Upload response (MintableLayerForm)", uploadResponse);
    layer.setMediaUri(uploadResponse.IpfsHash);
  }

  return (
    <Card>
      <Form 
        name={layer.id}
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
                    <AntIcon.QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
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
                    onChange={(recipient: string) => setTokenRecipient(recipient)}
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
                  initialValue={currentAddress}
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
                    placeholder={tokenRecipient === 'self' ? currentAddress : 'address'}
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
              <PinataDraggableDropzone singleFile={true} onSuccessfulUpload={handleSuccessfulUpload}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Switch
        style={{ float: 'left' }}
        checkedChildren={<AntIcon.CheckOutlined />}
        unCheckedChildren={<AntIcon.CloseOutlined />}
      />
    </Card>
  );
};

export default observer(MintableLayerForm);
