/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { IObservableArray } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { TokenModel, TokenModelType } from "./TokenModel"
import { TokenModelSelector } from "./TokenModel.base"
import { TokenTypeRelationshipModel, TokenTypeRelationshipModelType } from "./TokenTypeRelationshipModel"
import { TokenTypeRelationshipModelSelector } from "./TokenTypeRelationshipModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  tokens: IObservableArray<TokenModelType>;
  authorizedChildren: IObservableArray<TokenTypeRelationshipModelType>;
  authorizedParents: IObservableArray<TokenTypeRelationshipModelType>;
}

/**
 * TokenTypeBase
 * auto generated base class for the model TokenTypeModel.
 */
export const TokenTypeModelBase = withTypedRefs<Refs>()(ModelBase
  .named('TokenType')
  .props({
    __typename: types.optional(types.literal("TokenType"), "TokenType"),
    id: types.identifier,
    name: types.union(types.undefined, types.string),
    tokens: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => TokenModel)))),
    authorizedChildren: types.union(types.undefined, types.null, types.array(MSTGQLRef(types.late((): any => TokenTypeRelationshipModel)))),
    authorizedParents: types.union(types.undefined, types.null, types.array(MSTGQLRef(types.late((): any => TokenTypeRelationshipModel)))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class TokenTypeModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get name() { return this.__attr(`name`) }
  tokens(builder?: string | TokenModelSelector | ((selector: TokenModelSelector) => TokenModelSelector)) { return this.__child(`tokens`, TokenModelSelector, builder) }
  authorizedChildren(builder?: string | TokenTypeRelationshipModelSelector | ((selector: TokenTypeRelationshipModelSelector) => TokenTypeRelationshipModelSelector)) { return this.__child(`authorizedChildren`, TokenTypeRelationshipModelSelector, builder) }
  authorizedParents(builder?: string | TokenTypeRelationshipModelSelector | ((selector: TokenTypeRelationshipModelSelector) => TokenTypeRelationshipModelSelector)) { return this.__child(`authorizedParents`, TokenTypeRelationshipModelSelector, builder) }
}
export function selectFromTokenType() {
  return new TokenTypeModelSelector()
}

export const tokenTypeModelPrimitives = selectFromTokenType().name
