import { Instance } from "mobx-state-tree"
import { BlockModelBase } from "./BlockModel.base"

/* The TypeScript type of an instance of BlockModel */
export interface BlockModelType extends Instance<typeof BlockModel.Type> {}

/* A graphql query fragment builders for BlockModel */
export { selectFromBlock, blockModelPrimitives, BlockModelSelector } from "./BlockModel.base"

/**
 * BlockModel
 */
export const BlockModel = BlockModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
