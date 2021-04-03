/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * DebugBase
 * auto generated base class for the model DebugModel.
 */
export const DebugModelBase = ModelBase
  .named('Debug')
  .props({
    __typename: types.optional(types.literal("Debug"), "Debug"),
    id: types.identifier,
    message: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class DebugModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get message() { return this.__attr(`message`) }
}
export function selectFromDebug() {
  return new DebugModelSelector()
}

export const debugModelPrimitives = selectFromDebug().message
