import { Instance } from "mobx-state-tree"
import { TokenRelationshipModelBase } from "./TokenRelationshipModel.base"

/* The TypeScript type of an instance of TokenRelationshipModel */
export interface TokenRelationshipModelType extends Instance<typeof TokenRelationshipModel.Type> {}

/* A graphql query fragment builders for TokenRelationshipModel */
export { selectFromTokenRelationship, tokenRelationshipModelPrimitives, TokenRelationshipModelSelector } from "./TokenRelationshipModel.base"

/**
 * TokenRelationshipModel
 */
export const TokenRelationshipModel = TokenRelationshipModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
