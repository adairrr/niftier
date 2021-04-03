/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * PersistentStringBase
 * auto generated base class for the model PersistentStringModel.
 */
export const PersistentStringModelBase = ModelBase
  .named('PersistentString')
  .props({
    __typename: types.optional(types.literal("PersistentString"), "PersistentString"),
    id: types.identifier,
    value: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class PersistentStringModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get value() { return this.__attr(`value`) }
}
export function selectFromPersistentString() {
  return new PersistentStringModelSelector()
}

export const persistentStringModelPrimitives = selectFromPersistentString().value
