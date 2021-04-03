import { Instance } from "mobx-state-tree"
import { SenderModelBase } from "./SenderModel.base"

/* The TypeScript type of an instance of SenderModel */
export interface SenderModelType extends Instance<typeof SenderModel.Type> {}

/* A graphql query fragment builders for SenderModel */
export { selectFromSender, senderModelPrimitives, SenderModelSelector } from "./SenderModel.base"

/**
 * SenderModel
 */
export const SenderModel = SenderModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
