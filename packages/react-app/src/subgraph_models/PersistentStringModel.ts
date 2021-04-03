import { Instance } from "mobx-state-tree"
import { PersistentStringModelBase } from "./PersistentStringModel.base"

/* The TypeScript type of an instance of PersistentStringModel */
export interface PersistentStringModelType extends Instance<typeof PersistentStringModel.Type> {}

/* A graphql query fragment builders for PersistentStringModel */
export { selectFromPersistentString, persistentStringModelPrimitives, PersistentStringModelSelector } from "./PersistentStringModel.base"

/**
 * PersistentStringModel
 */
export const PersistentStringModel = PersistentStringModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
