import { makeAutoObservable } from 'mobx';
import { DraggableTabOrder } from '../components/DraggableTabs';
import MintableLayerStore from './MintableLayerStore';

export default class MintableLayerListStore {
  /* properties */
  layers: Array<MintableLayerStore> = [];

  /* computed functions */
  get layerCount(): number {
    return this.layers.length;
  }

  get layerPreviews(): string[] {
    return this.layers.slice().map(layer => layer.mediaPrevew);
  }

  async pinAndGetLayerUris(): Promise<string[]> {
    try {
      const layerUriPromises = this.layers.map(async layer => layer.pinMetadata());
      const layerUris = Promise.all(layerUriPromises);
      console.log(layerUris);
      return await layerUris;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /* action functions */
  addLayer(name: string): MintableLayerStore {
    const newLayer = new MintableLayerStore(name);
    this.layers.push(newLayer);
    return newLayer;
  }

  getLayerWithId(layerId: string): MintableLayerStore {
    return this.layers.find(layer => layer.id === layerId);
  }

  removeLayer(activeLayerId: string, removedId: string): string {
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

    let newActiveLayerId: string;

    // if the removed layer was the active layer, change the active layer
    if (afterRemoveTabs.length && activeLayerId === removedId) {
      if (lastIndex >= 0) {
        // eslint-disable-next-line no-param-reassign
        newActiveLayerId = afterRemoveTabs[lastIndex].id;
      } else {
        // eslint-disable-next-line no-param-reassign
        newActiveLayerId = afterRemoveTabs[0].id;
      }
    }
    return newActiveLayerId;
  }

  reorderLayers(newLayerOrder: DraggableTabOrder): void {
    const newOrder = newLayerOrder.order;

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
