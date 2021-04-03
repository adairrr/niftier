import { Instance } from "mobx-state-tree"
import { MetaModelBase } from "./MetaModel.base"

/* The TypeScript type of an instance of MetaModel */
export interface MetaModelType extends Instance<typeof MetaModel.Type> {}

/* A graphql query fragment builders for MetaModel */
export { selectFromMeta, metaModelPrimitives, MetaModelSelector } from "./MetaModel.base"

/**
 * MetaModel
 *
 * The type for the top-level _meta field
 */
export const MetaModel = MetaModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
