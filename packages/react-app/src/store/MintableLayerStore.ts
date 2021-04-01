import React from 'react';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { DraggableTabOrder } from '../components/DraggableTabs';
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
  setName(name: string) { this.name = name };
  setDescription(description: string) { this.description = description };
  setRecipientAddress(recipientAddress: string) { this.recipientAddress = recipientAddress };
  setMediaUri(mediaUri: string) { this.mediaUri = mediaUri };
  setMediaPrevew(mediaPrevew: string) { this.mediaPrevew = mediaPrevew };

  /* computed functions */
  get toMetadataJSON() {
    const metadataJSON = {};
    metadataJSON['name'] = this.name;
    metadataJSON['description'] = this.description;
    metadataJSON['image'] = `https://gateway.pinata.cloud/ipfs/${this.mediaUri}`;

    return metadataJSON;
  }

  /* action functions */

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

  deleteFromCache() {
		localStorage.removeItem(this.id);
  }


  constructor(layerName: string, autosave?: boolean) {
    makeAutoObservable(this, { deleteFromCache: false });
    this.name = layerName;
    // if (autosave) autoSave(this, this.id);
  }
}


export class MintableLayerListStore {
  /* properties */
  layers: Array<MintableLayerStore> = [];

  /* computed functions */
  get layerCount() {
    return this.layers.length;
  }

  get layerPreviews() {
    return this.layers.slice().map(layer => layer.mediaPrevew);
  }

  async pinAndGetLayerUris() {
    try {
      const layerUriPromises = this.layers.map(async layer => await layer.pinMetadata());
      const layerUris = Promise.all(layerUriPromises);
      console.log(layerUris);
      return layerUris;
    } catch (error) {
      console.log(error);
    }
  }


  /* action functions */
  addLayer(name: string) {
    const newLayer = new MintableLayerStore(name);
    this.layers.push(newLayer);
    return newLayer;
  }

  getLayerWithId(layerId: string){
    return this.layers.find(layer => layer.id === layerId);
  }

  removeLayer(activeLayerId: string, removedId: string) {
    let lastIndex: number;
    // iterate through tabs to find last index
    // TODO can we use findIndex? (-1)
    this.layers.forEach((layer, index) => {
      if (layer.id === removedId) {
        lastIndex = index - 1;
      }
    });

    // filter out the removed tab
    const afterRemoveTabs = this.layers.filter(layer => layer.id !== removedId);
    this.layers = afterRemoveTabs;

    // if the removed layer was the active layer, change the active layer
    if (afterRemoveTabs.length && activeLayerId === removedId) {
      if (lastIndex >= 0) {
        activeLayerId = afterRemoveTabs[lastIndex].id;
      } else {
        activeLayerId = afterRemoveTabs[0].id;
      }
    }
    return activeLayerId;
  }

  reorderLayers(newLayerOrder: DraggableTabOrder) {
    let newOrder = newLayerOrder.order;

    // sort the tabs by the order
    const orderedTabs = this.layers.slice().sort((a, b) => {
      return newOrder.indexOf(a.id) - newOrder.indexOf(b.id);
    });

    console.log(this.layers);
    console.log(newOrder);
    console.log(orderedTabs);

    this.layers = orderedTabs;
  }

  constructor(layers?: Array<MintableLayerStore>) {
    makeAutoObservable(this);
    if (layers) this.layers = layers;
  }
}
