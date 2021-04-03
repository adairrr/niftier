import { Instance } from "mobx-state-tree"
import { AccountModelBase } from "./AccountModel.base"
/* The TypeScript type of an instance of AccountModel */
export interface AccountModelType extends Instance<typeof AccountModel.Type> {}

/* A graphql query fragment builders for AccountModel */
export { selectFromAccount, accountModelPrimitives, AccountModelSelector } from "./AccountModel.base"

/**
 * AccountModel
 */
export const AccountModel = AccountModelBase.actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    },
  }))
