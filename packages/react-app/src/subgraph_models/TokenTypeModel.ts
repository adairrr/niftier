import { Instance } from "mobx-state-tree"
import { TokenTypeModelBase } from "./TokenTypeModel.base"

/* The TypeScript type of an instance of TokenTypeModel */
export interface TokenTypeModelType extends Instance<typeof TokenTypeModel.Type> {}

/* A graphql query fragment builders for TokenTypeModel */
export { selectFromTokenType, tokenTypeModelPrimitives, TokenTypeModelSelector } from "./TokenTypeModel.base"

/**
 * TokenTypeModel
 */
export const TokenTypeModel = TokenTypeModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
