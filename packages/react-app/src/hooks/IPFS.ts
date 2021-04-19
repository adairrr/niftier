/* eslint-disable */
import ipfsAPI from 'ipfs-http-client';
import { BufferList } from 'bl';

const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// helper function to "Get" from IPFS
// you usually go content.toString() after this...
const getFromIPFS = async (hashToGet: string) => {
  for await (const file of ipfs.get(hashToGet)) {
    console.log(file.path);
    // @ts-ignore
    if (file.content) {
      const content = new BufferList();
      // @ts-ignore
      for await (const chunk of file.content) {
        content.append(chunk);
      }
      console.log(content);
      return content;
    }
  }
};

export default getFromIPFS;
