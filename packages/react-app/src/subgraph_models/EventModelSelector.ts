/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { QueryBuilder } from "mst-gql"
import { ApprovalModelType } from "./ApprovalModel"
import { ApprovalModelSelector } from "./ApprovalModel.base"
import { TransactionModel, TransactionModelType } from "./TransactionModel"
import { TransactionModelSelector } from "./TransactionModel.base"
import { TransferModelType } from "./TransferModel"
import { TransferModelSelector } from "./TransferModel.base"

export type EventUnion = ApprovalModelType | TransferModelType

export class EventModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get timestamp() { return this.__attr(`timestamp`) }
  transaction(builder?: string | TransactionModelSelector | ((selector: TransactionModelSelector) => TransactionModelSelector)) { return this.__child(`transaction`, TransactionModelSelector, builder) }
  approval(builder?: string | ApprovalModelSelector | ((selector: ApprovalModelSelector) => ApprovalModelSelector)) { return this.__inlineFragment(`Approval`, ApprovalModelSelector, builder) }
  transfer(builder?: string | TransferModelSelector | ((selector: TransferModelSelector) => TransferModelSelector)) { return this.__inlineFragment(`Transfer`, TransferModelSelector, builder) }
}
export function selectFromEvent() {
  return new EventModelSelector()
}

export const eventModelPrimitives = selectFromEvent().timestamp