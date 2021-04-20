import { Instance } from 'mobx-state-tree';
import { PersistentStringArrayModelBase } from './PersistentStringArrayModel.base';

/* The TypeScript type of an instance of PersistentStringArrayModel */
export interface PersistentStringArrayModelType extends Instance<typeof PersistentStringArrayModel.Type> {}

/* A graphql query fragment builders for PersistentStringArrayModel */
export {
  selectFromPersistentStringArray,
  persistentStringArrayModelPrimitives,
  PersistentStringArrayModelSelector,
} from './PersistentStringArrayModel.base';

/**
 * PersistentStringArrayModel
 */
export const PersistentStringArrayModel = PersistentStringArrayModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self));
  },
}));
