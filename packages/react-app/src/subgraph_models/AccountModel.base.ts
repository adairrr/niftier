/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { IObservableArray } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { ApprovalModel, ApprovalModelType } from "./ApprovalModel"
import { ApprovalModelSelector } from "./ApprovalModel.base"
import { BalanceModel, BalanceModelType } from "./BalanceModel"
import { BalanceModelSelector } from "./BalanceModel.base"
import { TransferModel, TransferModelType } from "./TransferModel"
import { TransferModelSelector } from "./TransferModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  balances: IObservableArray<BalanceModelType>;
  transfersOperator: IObservableArray<TransferModelType>;
  transfersFrom: IObservableArray<TransferModelType>;
  transfersTo: IObservableArray<TransferModelType>;
  approvalsOwner: IObservableArray<ApprovalModelType>;
  approvalsSpender: IObservableArray<ApprovalModelType>;
}

/**
 * AccountBase
 * auto generated base class for the model AccountModel.
 */
export const AccountModelBase = withTypedRefs<Refs>()(ModelBase
  .named('Account')
  .props({
    __typename: types.optional(types.literal("Account"), "Account"),
    id: types.identifier,
    balances: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => BalanceModel)))),
    transfersOperator: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => TransferModel)))),
    transfersFrom: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => TransferModel)))),
    transfersTo: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => TransferModel)))),
    approvalsOwner: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => ApprovalModel)))),
    approvalsSpender: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => ApprovalModel)))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class AccountModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  balances(builder?: string | BalanceModelSelector | ((selector: BalanceModelSelector) => BalanceModelSelector)) { return this.__child(`balances`, BalanceModelSelector, builder) }
  transfersOperator(builder?: string | TransferModelSelector | ((selector: TransferModelSelector) => TransferModelSelector)) { return this.__child(`transfersOperator`, TransferModelSelector, builder) }
  transfersFrom(builder?: string | TransferModelSelector | ((selector: TransferModelSelector) => TransferModelSelector)) { return this.__child(`transfersFrom`, TransferModelSelector, builder) }
  transfersTo(builder?: string | TransferModelSelector | ((selector: TransferModelSelector) => TransferModelSelector)) { return this.__child(`transfersTo`, TransferModelSelector, builder) }
  approvalsOwner(builder?: string | ApprovalModelSelector | ((selector: ApprovalModelSelector) => ApprovalModelSelector)) { return this.__child(`approvalsOwner`, ApprovalModelSelector, builder) }
  approvalsSpender(builder?: string | ApprovalModelSelector | ((selector: ApprovalModelSelector) => ApprovalModelSelector)) { return this.__child(`approvalsSpender`, ApprovalModelSelector, builder) }
}
export function selectFromAccount() {
  return new AccountModelSelector()
}

export const accountModelPrimitives = selectFromAccount()
