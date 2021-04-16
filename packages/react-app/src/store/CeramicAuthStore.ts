import React, { createContext } from 'react';
import { flow, makeAutoObservable, runInAction } from 'mobx';
import { EthereumAuthProvider, ThreeIdConnect } from '3id-connect';
import { DIDProvider } from '@ceramicnetwork/common';
import CeramicClient from '@ceramicnetwork/http-client';
import { IDX } from '@ceramicstudio/idx';
import { DID } from 'dids'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { authenticateDid, createCeramic, createIDX, createThreeIdDidProvider } from '../apis';
import { getUserBasicProfile, setUserBasicProfile } from '../apis/idx';
import { BasicProfile } from '@ceramicstudio/idx-constants';

export class CeramicAuthStore {
  /* properties */
  threeIdConnect: ThreeIdConnect;
  isAuthorized: boolean = false;
  userDid: string = null;
  ceramicDid: DID = null;
  ceramic: CeramicClient;
  idx: IDX;
  didProvider: DIDProvider;
  did: DID;

  
  constructor(threeIdConnect: ThreeIdConnect) {
    // TODO check local storage for previous did?
    console.log("Just got to the constructor for CeramicAuthStore");
    makeAutoObservable(this, {
      login: flow
    });
    this.threeIdConnect = threeIdConnect;
    this.ceramic = createCeramic();
    this.idx = createIDX(this.ceramic);
  }

  /* computed functions */
  get isAuthenticated() {
    return this.isAuthorized;
  }

  /* action functions */
  *login() {
    console.log("Logging into the ceramic client and attempting to authenticate");
    
    this.didProvider = yield createThreeIdDidProvider(
      window.ethereum, 
      this.threeIdConnect, 
      this.ceramic
    );
    this.did = yield authenticateDid(this.didProvider, this.ceramic);
    this.userDid = this.did.id;
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

  *getUserProfile() {
    const prof = yield getUserBasicProfile(this.idx, this.userDid);
    console.log(prof);

  }

  *setUserProfile(userProfile: BasicProfile) {
    const docId = yield setUserBasicProfile(this.idx, userProfile);
    console.log(docId);
  }

}

export default CeramicAuthStore;
// we want a global connect
const threeID = new ThreeIdConnect();
export const CeramicAuthInstance = new CeramicAuthStore(threeID);
