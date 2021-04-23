import { Instance } from 'mobx-state-tree';
import { AccountDataModelBase } from './AccountDataModel.base';

/* The TypeScript type of an instance of AccountDataModel */
export interface AccountDataModelType extends Instance<typeof AccountDataModel.Type> {}

/* A graphql query fragment builders for AccountDataModel */
export { selectFromAccountData, accountDataModelPrimitives, AccountDataModelSelector } from './AccountDataModel.base';

/**
 * AccountDataModel
 */
export const AccountDataModel = AccountDataModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self));
  },
}));
