import { Instance, types, flow } from "mobx-state-tree"
import { TokenModelBase } from "./TokenModel.base"
import { PINATA_IPFS_PREFIX } from '../constants';
import { getFromIPFS } from "../hooks";
import { runInAction } from 'mobx';

/* The TypeScript type of an instance of TokenModel */
export interface TokenModelType extends Instance<typeof TokenModel.Type> {}

/* A graphql query fragment builders for TokenModel */
export { selectFromToken, tokenModelPrimitives, TokenModelSelector } from "./TokenModel.base"

/**
 * TokenModel
 */
export const TokenModel = TokenModelBase
.props({
  preview: types.optional(types.string, ''),
  name: types.optional(types.string, ''),
  description: types.optional(types.string, ''),
  // start with true and set to false once finished
  loadingMetadata: types.optional(types.boolean, true)
})
.actions(self => ({
  fetchMetadataFlow: flow(function* fetchMetadataFlow() {
    self.loadingMetadata = true;
    const tokenUri = self.uri.replace(PINATA_IPFS_PREFIX, '');
          
    console.log(`Fetching ipfs data for ${self.id} with uri: ${tokenUri}`);
    if (tokenUri != null) {
      // TODO could just fetch the full pinata url
      const jsonManifestBuffer = yield getFromIPFS(tokenUri);

      try {
        const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
        console.log('jsonManifest', jsonManifest);
        runInAction(() => {
          self.name = jsonManifest.name ? jsonManifest.name : '';
          self.description = jsonManifest.description ? jsonManifest.description : '';
          self.preview = jsonManifest.image ? jsonManifest.image : undefined;
          self.loadingMetadata = false;
        })
        return jsonManifest.image;
      } catch(e) {console.log(e)}
    }
  }),

  async fetchMetadata() {
    self.loadingMetadata = true;
    const tokenUri = self.uri.replace(PINATA_IPFS_PREFIX, '');
          
    console.log(`Fetching ipfs data for ${self.id} with uri: ${tokenUri}`);
    if (tokenUri != null) {
      // TODO could just fetch the full pinata url
      const jsonManifestBuffer = await getFromIPFS(tokenUri);

      try {
        const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
        console.log('jsonManifest', jsonManifest);
        runInAction(() => {
          self.name = jsonManifest.name ? jsonManifest.name : '';
          self.description = jsonManifest.description ? jsonManifest.description : '';
          self.preview = jsonManifest.image ? jsonManifest.image : undefined;
          self.loadingMetadata = false;
        })
        return jsonManifest.image;
      } catch(e) {console.log(e)}
    }
  }
}))
.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  },
  
  afterCreate() {
    self.fetchMetadataFlow();
  },

  
}))
