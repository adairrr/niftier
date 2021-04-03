import { Instance } from "mobx-state-tree"
import { ApprovalModelBase } from "./ApprovalModel.base"

/* The TypeScript type of an instance of ApprovalModel */
export interface ApprovalModelType extends Instance<typeof ApprovalModel.Type> {}

/* A graphql query fragment builders for ApprovalModel */
export { selectFromApproval, approvalModelPrimitives, ApprovalModelSelector } from "./ApprovalModel.base"

/**
 * ApprovalModel
 */
export const ApprovalModel = ApprovalModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
