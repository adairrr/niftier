import { Instance } from 'mobx-state-tree';
import { TransferModelBase } from './TransferModel.base';

/* The TypeScript type of an instance of TransferModel */
export interface TransferModelType extends Instance<typeof TransferModel.Type> {}

/* A graphql query fragment builders for TransferModel */
export { selectFromTransfer, transferModelPrimitives, TransferModelSelector } from './TransferModel.base';

/**
 * TransferModel
 */
export const TransferModel = TransferModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self));
  },
}));
