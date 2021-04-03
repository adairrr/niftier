/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * PersistentStringArrayBase
 * auto generated base class for the model PersistentStringArrayModel.
 */
export const PersistentStringArrayModelBase = ModelBase
  .named('PersistentStringArray')
  .props({
    __typename: types.optional(types.literal("PersistentStringArray"), "PersistentStringArray"),
    id: types.identifier,
    values: types.union(types.undefined, types.array(types.string)),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class PersistentStringArrayModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get values() { return this.__attr(`values`) }
}
export function selectFromPersistentStringArray() {
  return new PersistentStringArrayModelSelector()
}

export const persistentStringArrayModelPrimitives = selectFromPersistentStringArray().values
