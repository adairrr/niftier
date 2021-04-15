import React, { createContext } from 'react';
import { flow, makeAutoObservable, runInAction } from 'mobx';
import { EthereumAuthProvider, ThreeIdConnect } from '3id-connect';
import { DIDProvider } from '@ceramicnetwork/common';
import CeramicClient from '@ceramicnetwork/http-client';
import { IDX } from '@ceramicstudio/idx';
import { DID } from 'dids'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'


declare global {
  interface Window {
    did?: DID
    idx?: IDX
    ceramic?: CeramicClient,
    didProvider: any,
    didResolver: any
  }
}

const CERAMIC_URL = `http://${process.env.REACT_APP_CERAMIC_ADDRESS}`;

export class CeramicAuthStore {
  /* properties */
  threeIdConnect: ThreeIdConnect;
  isAuthorized: boolean = false;
  userDid: string = null;
  ceramicDid: DID = null;
  ceramic: CeramicClient;
  idx: IDX;
  didProvider: DIDProvider;

  
  constructor(threeIdConnect: ThreeIdConnect) {
    // TODO check local storage for previous did?
    console.log("Just got to the constructor for CeramicAuthStore");
    makeAutoObservable(this, {
      initCeramic: flow,
    });
    this.threeIdConnect = threeIdConnect;
  }

  /* computed functions */
  get isAuthenticated() {
    return this.isAuthorized;
  }

  /* action functions */
  login() {
    console.log("Logging into the ceramic client and attempting to authenticate");
    this.initCeramic();
    this.initThreeIdDidProvider();
    this.authenticateDid();
    this.initIDX();
  }

  logout() {
    this.clearCeramicAuth();
  }

  clearCeramicAuth() {
    this.isAuthorized = false;
    this.userDid = null;
    this.ceramicDid = null;
    this.ceramic = null;
    this.idx = null;
  }

  *initCeramic() {
    try {
      console.log('Attempting to initialize ceramic');
      // create the ceramic client
      const ceramic = new CeramicClient(CERAMIC_URL);
      this.ceramic = ceramic;

      // debug
      window.ceramic = ceramic;
      
      // create  the idx client
      this.initIDX();
    } catch (error) {
      console.log({ error });
    }
  }

  *initThreeIdDidProvider() {
    try {
      const addresses = yield window.ethereum.request({ method: 'eth_requestAccounts' });

      // This will prompt the user with a 3ID Connect permissions window.
      const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
      yield this.threeIdConnect.connect(authProvider);
      
      const didProvider = this.threeIdConnect.getDidProvider() as DIDProvider;

      yield this.ceramic.setDIDProvider(didProvider);
      this.didProvider = didProvider;

      // debug
      window.didProvider = didProvider;

      return didProvider;
    } catch (error) {
      console.log('initThreeIdDidProvider error: ', { error });
    }
  }

  *authenticateDid() {
    if (!this.ceramic) throw new Error('Ceramic must be initialized first')
    try {
      const did = new DID({
        provider: this.didProvider,
        //@ts-ignore
        resolver: ThreeIdResolver.getResolver(ceramic)
      });

      // console.log("did", did);
      window.did = did;
      window.didResolver = ThreeIdResolver.getResolver(this.ceramic);

      console.log('about to authenticate did');
    
      yield did.authenticate();
      
      console.log("did.id", did.id);

    } catch (error) {
      console.log('authenticateDid error: ', { error });
    }
  }

  initIDX() {
    try {
      // setup idx
      const aliases = {}
      // TODO see https://developers.idx.xyz/build/aliases/
      //https://developers.idx.xyz/guides/definitions/creating/
      // @ts-ignore
      const idx = new IDX({ ceramic: this.ceramic, aliases });
      this.idx = idx;

      // debug
      window.idx = idx;
    } catch (error) {
      console.log({ error });
    }
  }
}

export default CeramicAuthStore;
// we want a global connect
const threeID = new ThreeIdConnect();
export const CeramicAuthInstance = new CeramicAuthStore(threeID);
