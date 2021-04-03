import { Instance } from "mobx-state-tree"
import { TokenTypeRelationshipModelBase } from "./TokenTypeRelationshipModel.base"

/* The TypeScript type of an instance of TokenTypeRelationshipModel */
export interface TokenTypeRelationshipModelType extends Instance<typeof TokenTypeRelationshipModel.Type> {}

/* A graphql query fragment builders for TokenTypeRelationshipModel */
export { selectFromTokenTypeRelationship, tokenTypeRelationshipModelPrimitives, TokenTypeRelationshipModelSelector } from "./TokenTypeRelationshipModel.base"

/**
 * TokenTypeRelationshipModel
 */
export const TokenTypeRelationshipModel = TokenTypeRelationshipModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
