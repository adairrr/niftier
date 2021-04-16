import CeramicClient from '@ceramicnetwork/http-client';
import { AccountID, AccountIDParams } from 'caip';

declare global {
  interface Window {
    ceramic?: CeramicClient
  }
}

const CERAMIC_URL = `http://${process.env.REACT_APP_CERAMIC_ADDRESS}`;

export function createCeramic(ceramicUrl?: string): CeramicClient {
  const ceramic = new CeramicClient(ceramicUrl || CERAMIC_URL);

  // debug
  window.ceramic = ceramic;
  return ceramic;
}

export const ethAddressToDID = async (ceramic: CeramicClient, address: string): Promise<string> => {
  const account = {
    chainId: 'eip155:1',
    address: address.toLowerCase()
  } as AccountIDParams;

  const caip10Doc = await ceramic?.createDocument('caip10-link', {
    metadata: {
      family: 'caip10-link',
      controllers: [AccountID.format(account)]
    }
  });
  console.log(caip10Doc);
  return caip10Doc?.content;
}
