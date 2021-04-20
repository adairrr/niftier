import { Instance } from 'mobx-state-tree';
import { PurposeModelBase } from './PurposeModel.base';

/* The TypeScript type of an instance of PurposeModel */
export interface PurposeModelType extends Instance<typeof PurposeModel.Type> {}

/* A graphql query fragment builders for PurposeModel */
export { selectFromPurpose, purposeModelPrimitives, PurposeModelSelector } from './PurposeModel.base';

/**
 * PurposeModel
 */
export const PurposeModel = PurposeModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self));
  },
}));
