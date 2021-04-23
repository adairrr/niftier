import { Instance } from 'mobx-state-tree';
import { TokenRegistryModelBase } from './TokenRegistryModel.base';

/* The TypeScript type of an instance of TokenRegistryModel */
export interface TokenRegistryModelType extends Instance<typeof TokenRegistryModel.Type> {}

/* A graphql query fragment builders for TokenRegistryModel */
export {
  selectFromTokenRegistry,
  tokenRegistryModelPrimitives,
  TokenRegistryModelSelector,
} from './TokenRegistryModel.base';

/**
 * TokenRegistryModel
 */
export const TokenRegistryModel = TokenRegistryModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self));
  },
}));
