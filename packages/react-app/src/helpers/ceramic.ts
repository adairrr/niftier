import CeramicClient from '@ceramicnetwork/http-client';
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect';
import { IDX } from '@ceramicstudio/idx';


// localhost 7007 ceramic daemon
// const ceramicUrl = `http://${process.env.REACT_APP_CERAMIC_ADDRESS}`;
const ceramicUrl = `http://localhost:7007`;


export const initiateCeramicWithIDX = async () => {
  const addresses = await window.ethereum.enable()

  const ceramic = new CeramicClient(ceramicUrl);
  const threeIdConnect = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);

  const connectResult = await threeIdConnect.connect(authProvider);
  const didProvider = await threeIdConnect.getDidProvider();

  // @ts-ignore
  const didProvResult = await ceramic.setDIDProvider(didProvider);

  return ceramic;
}

export const initiateIDX = (ceramic: CeramicClient) => {
  // setup idx
  const aliases = {}
  // TODO see https://developers.idx.xyz/build/aliases/
  //https://developers.idx.xyz/guides/definitions/creating/
  return new IDX({ ceramic, aliases });
}
// did:3:kjzl6cwe1jw149vfa25gi287p09py9zii2pki0ch55a559iz2vy6fo2uehy8rki 
