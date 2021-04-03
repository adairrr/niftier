import { Instance } from "mobx-state-tree"
import { DecimalValueModelBase } from "./DecimalValueModel.base"

/* The TypeScript type of an instance of DecimalValueModel */
export interface DecimalValueModelType extends Instance<typeof DecimalValueModel.Type> {}

/* A graphql query fragment builders for DecimalValueModel */
export { selectFromDecimalValue, decimalValueModelPrimitives, DecimalValueModelSelector } from "./DecimalValueModel.base"

/**
 * DecimalValueModel
 */
export const DecimalValueModel = DecimalValueModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
