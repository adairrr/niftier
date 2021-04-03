/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { ApprovalModel } from "./ApprovalModel"
import { EventModelSelector } from "./EventModelSelector"
import { TransferModel } from "./TransferModel"
import { RootStoreType } from "./index"


/**
 * TransactionBase
 * auto generated base class for the model TransactionModel.
 */
export const TransactionModelBase = ModelBase
  .named('Transaction')
  .props({
    __typename: types.optional(types.literal("Transaction"), "Transaction"),
    id: types.identifier,
    timestamp: types.union(types.undefined, types.frozen()),
    blockNumber: types.union(types.undefined, types.frozen()),
    events: types.union(types.undefined, types.array(types.union(types.late(() => ApprovalModel), types.late(() => TransferModel)))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class TransactionModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get timestamp() { return this.__attr(`timestamp`) }
  get blockNumber() { return this.__attr(`blockNumber`) }
  events(builder?: string | EventModelSelector | ((selector: EventModelSelector) => EventModelSelector)) { return this.__child(`events`, EventModelSelector, builder) }
}
export function selectFromTransaction() {
  return new TransactionModelSelector()
}

export const transactionModelPrimitives = selectFromTransaction().timestamp.blockNumber
