/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { TokenModel, TokenModelType } from "./TokenModel"
import { TokenModelSelector } from "./TokenModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  parent: TokenModelType;
  child: TokenModelType;
}

/**
 * TokenRelationshipBase
 * auto generated base class for the model TokenRelationshipModel.
 */
export const TokenRelationshipModelBase = withTypedRefs<Refs>()(ModelBase
  .named('TokenRelationship')
  .props({
    __typename: types.optional(types.literal("TokenRelationship"), "TokenRelationship"),
    id: types.identifier,
    parent: types.union(types.undefined, MSTGQLRef(types.late((): any => TokenModel))),
    child: types.union(types.undefined, MSTGQLRef(types.late((): any => TokenModel))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class TokenRelationshipModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  parent(builder?: string | TokenModelSelector | ((selector: TokenModelSelector) => TokenModelSelector)) { return this.__child(`parent`, TokenModelSelector, builder) }
  child(builder?: string | TokenModelSelector | ((selector: TokenModelSelector) => TokenModelSelector)) { return this.__child(`child`, TokenModelSelector, builder) }
}
export function selectFromTokenRelationship() {
  return new TokenRelationshipModelSelector()
}

export const tokenRelationshipModelPrimitives = selectFromTokenRelationship()
