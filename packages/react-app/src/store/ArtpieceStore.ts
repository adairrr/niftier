import React from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
import { PinataResponse, uploadJson } from '../helpers/pinata';

export default class ArtpieceStore {
  /* properties */
  id: string = Date.now().toString();
  name: string = undefined;
  description: string = undefined;
  recipientAddress: string = undefined;
  mediaUri: string = undefined;
  metadataUri: string = undefined;
  mediaPrevew: string = undefined;

  /* setters */
  setName(name: string) { this.name = name };
  setDescription(description: string) { this.description = description };
  setRecipientAddress(recipientAddress: string) { this.recipientAddress = recipientAddress };
  setMediaUri(mediaUri: string) { this.mediaUri = mediaUri };
  setMediaPrevew(mediaPrevew: string) { this.mediaPrevew = mediaPrevew };

  get toMetadataJSON() {
    const metadataJSON = {};
    metadataJSON['name'] = this.name;
    metadataJSON['description'] = this.description;
    metadataJSON['image'] = `https://gateway.pinata.cloud/ipfs/${this.mediaUri}`;

    return metadataJSON;
  }

  async pinMetadata() {
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
  }

  /* action functions */

  constructor(artpieceName: string, autosave?: boolean) {
    makeAutoObservable(this);
    this.name = artpieceName;
  }
}
