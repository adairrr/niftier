import fetch from 'isomorphic-fetch'
// import pinataSDK from '@pinata/sdk'; // The pinata sdk is broken
import { FileWithPath } from "file-selector";

const pinataHeaders = {
  'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
  'pinata_secret_api_key': process.env.REACT_APP_PINATA_API_SECRET,
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: Date;
}

export async function uploadFile(file: FileWithPath) {

  const pinFileToIPFSUrl = `${process.env.REACT_APP_PINATA_API_URL}/pinning/pinFileToIPFS`

  let data = new FormData()
  data.append('file', file)

  const metadata = JSON.stringify({
    name: file.path,
    keyvalues: {},
  })

  data.append('pinataMetadata', metadata)

  // pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  })

  data.append('pinataOptions', pinataOptions)

  return fetch(pinFileToIPFSUrl, {
    headers: pinataHeaders,
    method: 'POST',
    // @ts-ignore
    body: data,
  });
}

// interface pinJSONToIPFSInterface {
//   name: string,
//   description?: string,
//   image: string,
// }

export async function uploadJson(jsonBody: string) {
  const pinJSONToIpfsUrl = `${process.env.REACT_APP_PINATA_API_URL}/pinning/pinJSONToIPFS`

  const jsonHeaders = pinataHeaders;
  jsonHeaders['Content-Type'] = 'application/json';

  return fetch(pinJSONToIpfsUrl, {
    headers: pinataHeaders,
    method: 'POST',
    // @ts-ignore
    body: jsonBody,
  });
}
