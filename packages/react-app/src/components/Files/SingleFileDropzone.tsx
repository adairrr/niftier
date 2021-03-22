import { FileAddOutlined } from '@ant-design/icons';
import Dragger from 'antd/lib/upload/Dragger';
import React, { FunctionComponent } from 'react';


type SingleFileDropzoneProps = {
  pinataUpload?: boolean;
}

export const SingleFileDropzone: FunctionComponent<SingleFileDropzoneProps> = ({ pinataUpload = true }) => {

  // static defaultProps = {
  //   fontSize: 16,
  //   minimized: false,
  //   size: 'short'
  // }

  return (
    <Dragger 
      name='file'
    >
      <p className="ant-upload-drag-icon">
        <FileAddOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </Dragger>
  )
}
