import { Instance } from 'mobx-state-tree';
import { AccountDataPayloadModelBase } from './AccountDataPayloadModel.base';

/* The TypeScript type of an instance of AccountDataPayloadModel */
export interface AccountDataPayloadModelType extends Instance<typeof AccountDataPayloadModel.Type> {}

/* A graphql query fragment builders for AccountDataPayloadModel */
export {
  selectFromAccountDataPayload,
  accountDataPayloadModelPrimitives,
  AccountDataPayloadModelSelector,
} from './AccountDataPayloadModel.base';

/**
 * AccountDataPayloadModel
 */
export const AccountDataPayloadModel = AccountDataPayloadModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self));
  },
}));
