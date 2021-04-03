/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { BlockModel, BlockModelType } from "./BlockModel"
import { BlockModelSelector } from "./BlockModel.base"
import { RootStoreType } from "./index"


/**
 * MetaBase
 * auto generated base class for the model MetaModel.
 *
 * The type for the top-level _meta field
 */
export const MetaModelBase = ModelBase
  .named('Meta')
  .props({
    __typename: types.optional(types.literal("_Meta_"), "_Meta_"),
    /** Information about a specific subgraph block. The hash of the block will be null if the _meta field has a block constraint that asks for a block number. It will be filled if the _meta field has no block constraint and therefore asks for the latest  block */
    block: types.union(types.undefined, types.late((): any => BlockModel)),
    /** The deployment ID */
    deployment: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class MetaModelSelector extends QueryBuilder {
  get deployment() { return this.__attr(`deployment`) }
  block(builder?: string | BlockModelSelector | ((selector: BlockModelSelector) => BlockModelSelector)) { return this.__child(`block`, BlockModelSelector, builder) }
}
export function selectFromMeta() {
  return new MetaModelSelector()
}

export const metaModelPrimitives = selectFromMeta().deployment
