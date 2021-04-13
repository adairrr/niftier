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
  isAuthorized: boolean = false;
  userDid: string = null;
  ceramicDid: DID = null;
  ceramic: CeramicClient;
  idx: IDX;
  threeIdConnect: ThreeIdConnect ;
  
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
      console.log("Within initCeramic");
      yield window.ethereum.enable();
      const addresses = yield window.ethereum.request({ method: 'eth_requestAccounts' });

      // This will prompt the user with a 3ID Connect permissions window.
      const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
      yield this.threeIdConnect.connect(authProvider);

      console.log("authProvider", authProvider);

      // create the ceramic client
      const ceramic = new CeramicClient(CERAMIC_URL);
      console.log("ceramic", ceramic);
      window.ceramic = ceramic;
      
      // create  the idx client
      this.initIDX();

      const didProvider = this.threeIdConnect.getDidProvider() as DIDProvider;
      window.didProvider = didProvider;
      //@ts-ignore
      window.didResolver = ThreeIdResolver.getResolver(ceramic);

      //@ts-ignore
      // const conf = yield ceramic.setDIDProvider(didProvider);

      // console.log("conf,", conf);

      const did = new DID({
        provider: didProvider,
        //@ts-ignore
        resolver: ThreeIdResolver.getResolver(ceramic)
      });

      // console.log("did", did);
      // window.did = did;

      console.log('about to authenticate did');
    
      yield did.authenticate();
      // console.log("did.id", did.id);

      console.log("ceramic,", ceramic);

      this.ceramic = ceramic;
      //@ts-ignore
      this.ceramicDid = ceramic.did;
    } catch (error) {
      console.log({ error });
    }
  }

  initIDX() {
    try {
      // setup idx
      const aliases = {}
      // TODO see https://developers.idx.xyz/build/aliases/
      //https://developers.idx.xyz/guides/definitions/creating/
      // @ts-ignore
      const idx = new IDX({ ceramic, aliases });
      this.idx = idx;
      window.idx = idx;
    } catch (error) {
      console.log({ error });
    }
  }
}

export default CeramicAuthStore;
const threeID = new ThreeIdConnect();
export const CeramicAuthInstance = new CeramicAuthStore(threeID);
