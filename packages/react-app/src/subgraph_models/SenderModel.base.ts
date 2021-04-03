/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { IObservableArray } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { PurposeModel, PurposeModelType } from "./PurposeModel"
import { PurposeModelSelector } from "./PurposeModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  purposes: IObservableArray<PurposeModelType>;
}

/**
 * SenderBase
 * auto generated base class for the model SenderModel.
 */
export const SenderModelBase = withTypedRefs<Refs>()(ModelBase
  .named('Sender')
  .props({
    __typename: types.optional(types.literal("Sender"), "Sender"),
    id: types.identifier,
    address: types.union(types.undefined, types.frozen()),
    purposes: types.union(types.undefined, types.null, types.array(MSTGQLRef(types.late((): any => PurposeModel)))),
    createdAt: types.union(types.undefined, types.frozen()),
    purposeCount: types.union(types.undefined, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class SenderModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get address() { return this.__attr(`address`) }
  get createdAt() { return this.__attr(`createdAt`) }
  get purposeCount() { return this.__attr(`purposeCount`) }
  purposes(builder?: string | PurposeModelSelector | ((selector: PurposeModelSelector) => PurposeModelSelector)) { return this.__child(`purposes`, PurposeModelSelector, builder) }
}
export function selectFromSender() {
  return new SenderModelSelector()
}

export const senderModelPrimitives = selectFromSender().address.createdAt.purposeCount
