/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { TokenTypeModel, TokenTypeModelType } from "./TokenTypeModel"
import { TokenTypeModelSelector } from "./TokenTypeModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  parent: TokenTypeModelType;
  child: TokenTypeModelType;
}

/**
 * TokenTypeRelationshipBase
 * auto generated base class for the model TokenTypeRelationshipModel.
 */
export const TokenTypeRelationshipModelBase = withTypedRefs<Refs>()(ModelBase
  .named('TokenTypeRelationship')
  .props({
    __typename: types.optional(types.literal("TokenTypeRelationship"), "TokenTypeRelationship"),
    id: types.identifier,
    parent: types.union(types.undefined, MSTGQLRef(types.late((): any => TokenTypeModel))),
    child: types.union(types.undefined, MSTGQLRef(types.late((): any => TokenTypeModel))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class TokenTypeRelationshipModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  parent(builder?: string | TokenTypeModelSelector | ((selector: TokenTypeModelSelector) => TokenTypeModelSelector)) { return this.__child(`parent`, TokenTypeModelSelector, builder) }
  child(builder?: string | TokenTypeModelSelector | ((selector: TokenTypeModelSelector) => TokenTypeModelSelector)) { return this.__child(`child`, TokenTypeModelSelector, builder) }
}
export function selectFromTokenTypeRelationship() {
  return new TokenTypeRelationshipModelSelector()
}

export const tokenTypeRelationshipModelPrimitives = selectFromTokenTypeRelationship()
