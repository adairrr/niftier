import { EthereumAuthProvider, ThreeIdConnect } from '3id-connect';
import { DIDProvider } from '@ceramicnetwork/common';
import CeramicClient from '@ceramicnetwork/http-client';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { DID } from 'dids'

declare global {
  interface Window {
    didProvider: DIDProvider,
    did: DID,
    didResolver: any
  }
}

export async function createThreeIdDidProvider(
  ethProvider: any,
  threeIdConnect: ThreeIdConnect,
  ceramic: CeramicClient
): Promise<DIDProvider> {
  try {
    const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    // This will prompt the user with a 3ID Connect permissions window.
    const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
    await threeIdConnect.connect(authProvider);
    
    const didProvider = threeIdConnect.getDidProvider() as DIDProvider;

    await ceramic.setDIDProvider(didProvider);

    // debug
    window.didProvider = didProvider;

    return didProvider;
  } catch (error) {
    console.log('createThreeIdDidProvider error: ', { error });
  }
}

export async function authenticateDid(
  didProvider: DIDProvider,
  ceramic: CeramicClient
): Promise<DID> {
  try {
    const did = new DID({
      provider: didProvider,
      resolver: ThreeIdResolver.getResolver(ceramic)
    });

    // console.log("did", did);
    window.did = did;
    window.didResolver = ThreeIdResolver.getResolver(ceramic);

    console.log('about to authenticate did');
  
    await did.authenticate();
    
    console.log("Authenticated did: ", did.id);
    return did;
  } catch (error) {
    console.log('authenticateDid error: ', { error });
  }
}
