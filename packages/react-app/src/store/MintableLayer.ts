import React from 'react'
import { makeAutoObservable, toJS } from 'mobx'
import { DraggableTabOrder } from '../components/DraggableTabs';
import autoSave from './AutoSave';

export default class MintableLayer {
  /* properties */
  id: string = Date.now().toString();
  name: string = undefined;
  description: string = undefined;
  recipientAddress: string = undefined;
  mediaUri: string = undefined;
  mediaPrevew: string = undefined;

  /* setters */
  setName(name: string) { this.name = name };
  setDescription(description: string) { this.description = description };
  setRecipientAddress(recipientAddress: string) { this.recipientAddress = recipientAddress };
  setMediaUri(mediaUri: string) { this.mediaUri = mediaUri };
  setMediaPrevew(mediaPrevew: string) { this.mediaPrevew = mediaPrevew };

  /* action functions */

  deleteFromCache() {
		localStorage.removeItem(this.id);
  }

  constructor(layerName: string, autosave?: boolean) {
    makeAutoObservable(this, { deleteFromCache: false });
    this.name = layerName;
    if (autosave) autoSave(this, this.id);
  }
}


export class MintableLayerList {
  /* properties */
  layers: Array<MintableLayer> = [];

  /* computed functions */
  get layerCount() {
    return this.layers.length;
  }

  get layerPreviews() {
    return this.layers.slice().map(layer => layer.mediaPrevew);
  }

  /* action functions */
  addLayer(name: string) {
    const newLayer = new MintableLayer(name);
    this.layers.push(newLayer);
    return newLayer;
  }

  removeLayer(activeLayerId: string, removedId: string) {
    let lastIndex: number;
    // iterate through tabs to find last index
    this.layers.forEach((layer, index) => {
      if (layer.id === removedId) {
        lastIndex = index - 1;
      }
    });

    // filter out the removed tab
    const afterRemoveTabs = this.layers.filter(layerTab => layerTab.id !== removedId);
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

  constructor(layers?: Array<MintableLayer>) {
    makeAutoObservable(this);
    if (layers) this.layers = layers;
  }
}
