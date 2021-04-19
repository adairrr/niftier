import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'
import styled, { css } from 'styled-components'
import { Button } from "antd";
import { uploadFileWithPath } from '../helpers/pinata'

const Wrapper = styled.div`
  display: grid;
`

const Fields = styled.div`
  display: grid;
  grid-row-gap: 20px;
`

const getColor = ({ isDragAccept, isDragReject, isDragActive }) => {
  if (isDragAccept) {
    return '#00e676'
  }

  if (isDragReject) {
    return '#ff1744'
  }

  if (isDragActive) {
    return '#2196f3'
  }

  return '#eeeeee'
}

const DropzoneContainer = styled.div`
  ${({ theme: { bp, dp, ...theme }, ...props }) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${getColor(props)};
    border-style: dashed;
    color: #bdbdbd;
    outline: none;
    transition: border 0.24s ease-in-out;
  `}
`

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  padding: 20
};

const thumb = {
  position: "relative",
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

const img = {
  display: "block",
  width: "auto",
  height: "100%"
};

export default function PinataDropzone({ onSuccessfulUpload }) {

  const [ filenames, setFilenames ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ uploadResponse, setUploadResponse ] = useState({});
  const [ previews, setPreviews ] = useState([]);
  const [ uploading, setUploading ] = useState(false);

  const {
    getRootProps,
    acceptedFiles,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    onDrop: (files) => {
      let names = [];
      let previews = [];
      files.forEach((file) => {
        console.log(file);
        names.push(file.name);
        // add a preview to each file
        previews.push(URL.createObjectURL(file))
      })
      setFilenames(names);
      setPreviews(previews);
    },
  });

  async function upload() {
    // Upload file to Pinata/IPFS:
    console.log("Uploading file")
    setUploading(true);

    const uploadResp = await uploadFileWithPath(acceptedFiles[0]);
    const uploadData = await uploadResp.json();

    console.log(`Upload data : ${uploadData}`);
    setUploadResponse(uploadData);
    setUploading(false);
    // call props hook
    onSuccessfulUpload(uploadData);
  }

  const filesAvailableForUpload = acceptedFiles.length > 0;

  const thumbs = previews.map((filePreview, index) => (
    <div style={thumb} key={filenames[index]}>
      <div style={thumbInner}>
        <img src={filePreview} style={img} alt="" />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      acceptedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [acceptedFiles],
  );

  return (
    <>

      <h1>Upload</h1>

      <Fields>
        <DropzoneContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
          <input {...getInputProps()} />
          <p>Drag `$n` drop some files here, or click to select files</p>
        </DropzoneContainer>
        <aside style={thumbsContainer}>{thumbs}</aside>

        {/* <Input
          type="text"
          name="title"
          placeholder="Filename"
          onChange={e => setTitle(e.target.value)}
          value={title}
        /> */}

        {filesAvailableForUpload && (
          <div>
            <Button style={{margin:8}} loading={uploading} size="large" shape="round" type="primary" onClick={upload}>
              Upload Image
            </Button>
          </div>
        )}
      </Fields>
    </>
  );
}
