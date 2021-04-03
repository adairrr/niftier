import CeramicClient from '@ceramicnetwork/http-client';
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect';
import { DIDProvider } from '@ceramicnetwork/common';
import { IDX } from '@ceramicstudio/idx';
import type { DID } from 'dids'

// localhost 7007 ceramic daemon
// const ceramicUrl = `http://${process.env.REACT_APP_CERAMIC_ADDRESS}`;
const CERAMIC_URL = `http://localhost:7007`;

declare global {
  interface Window {
    did?: DID
    idx?: IDX
    ceramic?: CeramicClient
  }
}


export const initiateCeramicWithIDX = async () => {
  // const accounts = await ethereum.send('eth_requestAccounts');
  const addresses = await window.ethereum.enable();


  const ceramic = new CeramicClient(CERAMIC_URL);
  const threeIdConnect = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);

  await threeIdConnect.connect(authProvider);
  const didProvider = await threeIdConnect.getDidProvider() as DIDProvider;

  await ceramic.setDIDProvider(didProvider);

  initiateIDX(ceramic);

  window.ceramic = ceramic;
  window.did = ceramic.did;
  console.log(ceramic.did);

  return ceramic;
}

export const initiateIDX = (ceramic: CeramicClient) => {
  // setup idx
  const aliases = {}
  // TODO see https://developers.idx.xyz/build/aliases/
  //https://developers.idx.xyz/guides/definitions/creating/
  // @ts-ignore
  const idx = new IDX({ ceramic, aliases });
  window.idx = idx;
  console.log(idx);
  return idx;
}
// did:3:kjzl6cwe1jw149vfa25gi287p09py9zii2pki0ch55a559iz2vy6fo2uehy8rki 
