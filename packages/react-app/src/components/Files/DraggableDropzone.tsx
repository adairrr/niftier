import React, { useState, useCallback, useRef } from "react";
import "antd/dist/antd.css";
import { Upload, Button, message, Tooltip, Modal } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { uploadFileCustomRequest, pinFileToIPFSUrl, unpinFile, PinataResponse } from '../../helpers/pinata';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';



type PinataListUploadProps = {
  onSuccessfulUpload: any;
}
const PinataListUpload: React.FC<PinataListUploadProps> = ({ onSuccessfulUpload }) => {
  const [ fileList, setFileList ] = useState([]);
  const [ pinataResponseMap, setPinataResponseMap] = useState<Map<string, PinataResponse>>(new Map());
  const [ previewVisible, setPreviewVisible ] = useState(false);
  const [ previewImage, setPreviewImage ] = useState('');
  const [ previewTitle, setPreviewTitle ] = useState('');

  const onChangeFile = ({ file: newFile, fileList: newFileList, event }) => {
    console.log(event);
    setFileList(newFileList);

    switch(newFile.status) {
      case 'uploading':
        console.log(newFile, newFileList);
        break;
      case 'done':
        message.success(`${newFile.name} file uploaded successfully`);
        pinataResponseMap.set(newFile.uid, newFile.response.data);
        // TODO need to account for all files!!!!!!
        onSuccessfulUpload(newFile.response.data);
        setPinataResponseMap(pinataResponseMap);
        break;
      case 'error': 
        message.error(`${newFile.name} file upload failed.`);
        break;
      default:
        // code block
        // TODO what do?
        break;
    }
  };

  const onRemoveFile = async (removedFile) => {
    // remove from ipfs
    const filePinataResponse = pinataResponseMap.get(removedFile.uid);
    if (filePinataResponse && filePinataResponse.IpfsHash) {
      const unpinResp = await unpinFile(filePinataResponse.IpfsHash);
      if (!unpinResp.ok) {
        console.log(`File was not successfully unpinned; error: ${unpinResp}`)
      }
      pinataResponseMap.delete(removedFile.uid);
      setPinataResponseMap(pinataResponseMap);
    }

    // remove file from filelist
    const index = fileList.indexOf(removedFile);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);

    // TODO this is not always the case
    message.success(`${removedFile.name} file removed successfully`);
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handlePreviewCancel = () => setPreviewVisible(false);


  const progressStyle = {
    strokeColor: {
      "0%": "#108ee9",
      "100%": "#87d068"
    },
    strokeWidth: 3,
    format: (percent) => `${parseFloat(percent.toFixed(2))}%`
  };

  return (
    <DndProvider backend={HTML5Backend}>
      
      <Upload
        action={pinFileToIPFSUrl}
        listType="picture-card"
        fileList={fileList}
        onChange={onChangeFile}
        onPreview={handlePreview}
        // showUploadList={{showPreviewIcon: true}}
        progress={progressStyle}
        onRemove={onRemoveFile}
        customRequest={uploadFileCustomRequest}
        // itemRender={(originNode, file, currFileList) => (
        //   <DraggableUploadListItem
        //     originNode={originNode}
        //     file={file}
        //     fileList={currFileList}
        //     moveRow={moveRow}
        //   />
        // )}
      >
        {/* <Button icon={<UploadOutlined />}>Click to Add Files</Button> */}
        {uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handlePreviewCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </DndProvider>
  );
};

function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default PinataListUpload;

// 
