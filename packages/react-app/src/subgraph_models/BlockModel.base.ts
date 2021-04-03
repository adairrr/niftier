/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * BlockBase
 * auto generated base class for the model BlockModel.
 */
export const BlockModelBase = ModelBase
  .named('Block')
  .props({
    __typename: types.optional(types.literal("_Block_"), "_Block_"),
    /** The hash of the block */
    hash: types.union(types.undefined, types.null, types.frozen()),
    /** The block number */
    number: types.union(types.undefined, types.integer),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class BlockModelSelector extends QueryBuilder {
  get hash() { return this.__attr(`hash`) }
  get number() { return this.__attr(`number`) }
}
export function selectFromBlock() {
  return new BlockModelSelector()
}

export const blockModelPrimitives = selectFromBlock().hash.number
