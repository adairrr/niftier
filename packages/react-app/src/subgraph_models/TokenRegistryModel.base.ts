/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { IObservableArray } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { TokenModel, TokenModelType } from "./TokenModel"
import { TokenModelSelector } from "./TokenModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  tokens: IObservableArray<TokenModelType>;
}

/**
 * TokenRegistryBase
 * auto generated base class for the model TokenRegistryModel.
 */
export const TokenRegistryModelBase = withTypedRefs<Refs>()(ModelBase
  .named('TokenRegistry')
  .props({
    __typename: types.optional(types.literal("TokenRegistry"), "TokenRegistry"),
    id: types.identifier,
    tokens: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => TokenModel)))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class TokenRegistryModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  tokens(builder?: string | TokenModelSelector | ((selector: TokenModelSelector) => TokenModelSelector)) { return this.__child(`tokens`, TokenModelSelector, builder) }
}
export function selectFromTokenRegistry() {
  return new TokenRegistryModelSelector()
}

export const tokenRegistryModelPrimitives = selectFromTokenRegistry()
