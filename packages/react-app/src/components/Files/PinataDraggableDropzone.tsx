import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Upload, message, Modal, Card, Image } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as AntIcon from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { uploadFileCustomRequest, pinFileToIPFSUrl, unpinFile, PinataResponse } from '../../helpers/pinata';

const { Dragger } = Upload;

export interface FilePreview {
  fileUrlPreview?: string;
}

type PinataDraggableDropzoneProps = {
  onSuccessfulUpload?: any;
  singleFile?: boolean;
  onChange?: (value: FilePreview) => void;
};
const PinataDraggableDropzone: React.FC<PinataDraggableDropzoneProps> = ({
  onSuccessfulUpload = undefined,
  singleFile = false,
  onChange,
}) => {
  const [fileList, setFileList] = useState([]);
  const [pinataResponseMap, setPinataResponseMap] = useState<Map<string, PinataResponse>>(new Map());
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [singleImageUrl, setSingleImageUrl] = useState(null);

  const triggerPreviewChange = (changedValue: FilePreview) => {
    onChange?.({ ...changedValue });
  };

  const onChangeFile = async ({ file: newFile, fileList: newFileList, event }) => {
    console.log(event);
    setFileList(newFileList);

    switch (newFile.status) {
      case 'uploading':
        setUploading(true);
        console.log(newFile, newFileList);
        break;
      case 'done':
        setUploading(false);
        message.success(`${newFile.name} file uploaded successfully`);
        pinataResponseMap.set(newFile.uid, newFile.response.data);
        // TODO need to account for all files!!!!!!
        if (onSuccessfulUpload) onSuccessfulUpload(newFile.response.data);
        setPinataResponseMap(pinataResponseMap);

        await assignFilePreview(newFile);

        setSingleImageUrl(newFile.url || newFile.preview);
        triggerPreviewChange({ fileUrlPreview: newFile.url || newFile.preview });

        break;
      case 'error':
        setUploading(false);
        message.error(`${newFile.name} file upload failed.`);
        break;
      default:
        // code block
        // TODO what do?
        break;
    }
  };

  const assignFilePreview = async (file: UploadFile) => {
    // TODO this only really works for images and we'll probably want an audio preview and other previews.
    if (!file.url && !file.preview) {
      // @ts-ignore
      file.preview = await getBase64(file.originFileObj);
    }
  };

  const onRemoveFile = async removedFile => {
    // remove from ipfs
    const filePinataResponse = pinataResponseMap.get(removedFile.uid);
    if (filePinataResponse && filePinataResponse.IpfsHash) {
      const unpinResp = await unpinFile(filePinataResponse.IpfsHash);
      if (!unpinResp.ok) {
        console.log(`File was not successfully unpinned; error: ${unpinResp}`);
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
  };

  const handlePreview = async (file: UploadFile) => {
    await assignFilePreview(file);

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const uploadButton = (
    <div>
      <AntIcon.PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handlePreviewCancel = () => setPreviewVisible(false);

  const progressStyle = {
    strokeColor: {
      '0%': '#108ee9',
      '100%': '#87d068',
    },
    strokeWidth: 3,
    format: percent => `${parseFloat(percent.toFixed(2))}%`,
  };

  const singleUploadButton = (
    <div className="ant-upload-drag-icon">
      {uploading ? (
        <AntIcon.LoadingOutlined />
      ) : (
        <>
          <AntIcon.FileAddOutlined />
          <p className="ant-upload-text">Click or drag to upload media</p>
          <p className="ant-upload-hint">Image/Audio/Video/3D</p>
        </>
      )}
    </div>
  );

  const singleFileUpload = (
    <>
      {singleImageUrl ? (
        // <Card
        //   cover={
        //     <img src={singleImageUrl}/* style={{ width: '100%' }} */ />
        //   }
        //   actions={[
        //     <SettingOutlined key="setting" />,
        //     <EditOutlined key="edit" />,
        //     <EllipsisOutlined key="ellipsis" />,
        //   ]}
        // >
        // </Card>
        <Image src={singleImageUrl} width="100%" />
      ) : (
        <Dragger
          name="file"
          action={pinFileToIPFSUrl}
          onChange={onChangeFile}
          customRequest={uploadFileCustomRequest}
          onRemove={onRemoveFile}
          showUploadList={false}
          listType="picture"
        >
          {singleUploadButton}
        </Dragger>
      )}
    </>
  );

  const pictureCardUpload = (
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
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </DndProvider>
  );

  return singleFile ? singleFileUpload : pictureCardUpload;
};

function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default PinataDraggableDropzone;

//
