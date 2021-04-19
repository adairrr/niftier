import CeramicClient from '@ceramicnetwork/http-client';
import { EthereumAuthProvider, ThreeIdConnect } from '3id-connect';
import { DIDProvider } from '@ceramicnetwork/common';
import { IDX } from '@ceramicstudio/idx';
import { AccountID, AccountIDParams } from 'caip';
import { DID } from 'dids';
import type { CeramicApi } from '@ceramicnetwork/common';

// localhost 7007 ceramic daemon
// const CERAMIC_URL = `http://${process.env.REACT_APP_CERAMIC_ADDRESS}`;
const CERAMIC_URL = `http://67.187.100.116:7007`;
declare global {
  interface Window {
    // did?: DID
    idx?: IDX;
    ceramic?: CeramicClient;
  }
}

export const initiateIDX = (ceramic: CeramicClient): IDX => {
  // setup idx
  const aliases = {};
  // TODO see https://developers.idx.xyz/build/aliases/
  // https://developers.idx.xyz/guides/definitions/creating/
  // @ts-ignore
  const idx = new IDX({ ceramic, aliases });
  window.idx = idx;
  console.log(idx);
  return idx;
};

export const initiateCeramicWithIDX = async (): Promise<CeramicClient> => {
  // const accounts = await ethereum.send('eth_requestAccounts');
  const addresses = await window.ethereum.enable();

  const threeIdConnect = new ThreeIdConnect();
  console.log(window.ethereum);
  const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);

  await threeIdConnect.connect(authProvider);
  const didProvider = (await threeIdConnect.getDidProvider()) as DIDProvider;

  console.log(didProvider);

  const ceramic = new CeramicClient(CERAMIC_URL);
  await ceramic.setDIDProvider(didProvider);

  console.log(ceramic);

  initiateIDX(ceramic);

  window.ceramic = ceramic;
  // @ts-ignore
  window.did = ceramic.did;
  console.log(ceramic.did);

  return ceramic;
};

// did:3:kjzl6cwe1jw149vfa25gi287p09py9zii2pki0ch55a559iz2vy6fo2uehy8rki

export const ethAddressToDID = async (address: string): Promise<string> => {
  const account = {
    chainId: 'eip155:1',
    address: address.toLowerCase(),
  } as AccountIDParams;

  const caip10Doc = await window.ceramic?.createDocument('caip10-link', {
    metadata: {
      family: 'caip10-link',
      controllers: [AccountID.format(account)],
    },
  });
  return caip10Doc?.content;
};
