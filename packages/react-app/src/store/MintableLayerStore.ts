import React from 'react';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import autoSave from './AutoSave';
import { PinataResponse, unpinFile, uploadJson } from '../helpers/pinata';

export default class MintableLayerStore {
  /* properties */
  id: string = Date.now().toString();

  name: string = undefined;

  description: string = undefined;

  recipientAddress: string = undefined;

  mediaUri: string = undefined;

  metadataUri: string = undefined;

  mediaPrevew: string = undefined;

  /* setters */
  setName(name: string): void {
    this.name = name;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  setRecipientAddress(recipientAddress: string): void {
    this.recipientAddress = recipientAddress;
  }

  setMediaUri(mediaUri: string): void {
    this.mediaUri = mediaUri;
  }

  setMediaPrevew(mediaPrevew: string): void {
    this.mediaPrevew = mediaPrevew;
  }

  /* computed functions */
  get toMetadataJSON() {
    const metadataJSON = {
      name: this.name,
      description: this.description,
      image: `https://gateway.pinata.cloud/ipfs/${this.mediaUri}`,
    };

    return metadataJSON;
  }

  /* action functions */

  async pinMetadata(): Promise<string> {
    try {
      const uploadResp = await uploadJson(JSON.stringify(this.toMetadataJSON));
      const uploadData: PinataResponse = await uploadResp.json();

      runInAction(() => {
        this.metadataUri = uploadData.IpfsHash;
      });
      return uploadData.IpfsHash;
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  deleteFromCache() {
    localStorage.removeItem(this.id);
  }

  constructor(layerName: string, autosave?: boolean) {
    makeAutoObservable(this, { deleteFromCache: false });
    this.name = layerName;
    // if (autosave) autoSave(this, this.id);
  }
}
