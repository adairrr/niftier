/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { SenderModel, SenderModelType } from "./SenderModel"
import { SenderModelSelector } from "./SenderModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  sender: SenderModelType;
}

/**
 * PurposeBase
 * auto generated base class for the model PurposeModel.
 */
export const PurposeModelBase = withTypedRefs<Refs>()(ModelBase
  .named('Purpose')
  .props({
    __typename: types.optional(types.literal("Purpose"), "Purpose"),
    id: types.identifier,
    sender: types.union(types.undefined, MSTGQLRef(types.late((): any => SenderModel))),
    purpose: types.union(types.undefined, types.string),
    createdAt: types.union(types.undefined, types.frozen()),
    transactionHash: types.union(types.undefined, types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class PurposeModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get purpose() { return this.__attr(`purpose`) }
  get createdAt() { return this.__attr(`createdAt`) }
  get transactionHash() { return this.__attr(`transactionHash`) }
  sender(builder?: string | SenderModelSelector | ((selector: SenderModelSelector) => SenderModelSelector)) { return this.__child(`sender`, SenderModelSelector, builder) }
}
export function selectFromPurpose() {
  return new PurposeModelSelector()
}

export const purposeModelPrimitives = selectFromPurpose().purpose.createdAt.transactionHash
