import fetch from 'isomorphic-fetch';
// import pinataSDK from '@pinata/sdk'; // The pinata sdk is broken
import { FileWithPath } from 'file-selector';
import { RcFile } from 'antd/lib/upload';
import axios, { AxiosResponse } from 'axios';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

const pinataHeaders = {
  pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
  pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
};

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: Date;
}

export const pinFileToIPFSUrl = `${process.env.REACT_APP_PINATA_API_URL}/pinning/pinFileToIPFS`;

// file is probably RCFile?
export function getFileFormDataWithMetadata(file: any, fileName?: string) {
  const data = new FormData();
  data.append('file', file);

  const metadata = JSON.stringify({
    name: fileName || file.uid,
    keyvalues: {},
  });

  data.append('pinataMetadata', metadata);

  // pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });

  data.append('pinataOptions', pinataOptions);

  return data;
}

export function uploadFileCustomRequest(customRequest: RcCustomRequestOptions) {
  const data = getFileFormDataWithMetadata(customRequest.file, customRequest.filename);

  return (
    axios
      .post(pinFileToIPFSUrl, data, {
        // @ts-ignore
        maxBodyLength: 'Infinity', // this is needed to prevent axios from erroring out with large files
        headers: {
          // @ts-ignore
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
        },
      })
      // @ts-ignore
      .then(customRequest.onSuccess)
      .catch(customRequest.onError)
  );
}

export async function uploadFile(file: File): Promise<PinataResponse> {
  const data = getFileFormDataWithMetadata(file);

  let response: AxiosResponse<any>;
  let errored = false;

  await axios
    .post(pinFileToIPFSUrl, data, {
      // @ts-ignore
      maxBodyLength: 'Infinity', // this is needed to prevent axios from erroring out with large files
      headers: {
        // @ts-ignore
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
      },
    })
    .then(resp => {
      // console.log("Response from uploadFile", resp);
      response = resp;
    })
    .catch(error => {
      errored = true;
      console.log(error);
    });

  return !errored ? (response.data as PinataResponse) : null;
}

export async function uploadFileWithPath(file: FileWithPath) {
  const data = new FormData();
  data.append('file', file);

  const metadata = JSON.stringify({
    name: file.path,
    keyvalues: {},
  });

  data.append('pinataMetadata', metadata);

  // pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });

  data.append('pinataOptions', pinataOptions);

  return fetch(pinFileToIPFSUrl, {
    headers: pinataHeaders,
    method: 'POST',
    // @ts-ignore
    body: data,
  });
}

export function unpinFile(hashToUnpin: string) {
  const unpinUrl = `${process.env.REACT_APP_PINATA_API_URL}/pinning/unpin/${hashToUnpin}`;

  return fetch(unpinUrl, {
    headers: pinataHeaders,
    method: 'DELETE',
  });
}

export async function uploadJson(jsonBody: string) {
  const pinJSONToIpfsUrl = `${process.env.REACT_APP_PINATA_API_URL}/pinning/pinJSONToIPFS`;

  const jsonHeaders = pinataHeaders;
  jsonHeaders['Content-Type'] = 'application/json';

  return fetch(pinJSONToIpfsUrl, {
    headers: pinataHeaders,
    method: 'POST',
    // @ts-ignore
    body: jsonBody,
  });
}
