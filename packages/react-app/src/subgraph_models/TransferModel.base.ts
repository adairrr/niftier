/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { AccountModel, AccountModelType } from "./AccountModel"
import { AccountModelSelector } from "./AccountModel.base"
import { BalanceModel, BalanceModelType } from "./BalanceModel"
import { BalanceModelSelector } from "./BalanceModel.base"
import { TokenModel, TokenModelType } from "./TokenModel"
import { TokenModelSelector } from "./TokenModel.base"
import { TransactionModel, TransactionModelType } from "./TransactionModel"
import { TransactionModelSelector } from "./TransactionModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  transaction: TransactionModelType;
  token: TokenModelType;
  operator: AccountModelType;
  from: AccountModelType;
  fromBalance: BalanceModelType;
  to: AccountModelType;
  toBalance: BalanceModelType;
}

/**
 * TransferBase
 * auto generated base class for the model TransferModel.
 */
export const TransferModelBase = withTypedRefs<Refs>()(ModelBase
  .named('Transfer')
  .props({
    __typename: types.optional(types.literal("Transfer"), "Transfer"),
    id: types.identifier,
    transaction: types.union(types.undefined, MSTGQLRef(types.late((): any => TransactionModel))),
    timestamp: types.union(types.undefined, types.frozen()),
    token: types.union(types.undefined, MSTGQLRef(types.late((): any => TokenModel))),
    operator: types.union(types.undefined, MSTGQLRef(types.late((): any => AccountModel))),
    from: types.union(types.undefined, MSTGQLRef(types.late((): any => AccountModel))),
    fromBalance: types.union(types.undefined, types.null, MSTGQLRef(types.late((): any => BalanceModel))),
    to: types.union(types.undefined, MSTGQLRef(types.late((): any => AccountModel))),
    toBalance: types.union(types.undefined, types.null, MSTGQLRef(types.late((): any => BalanceModel))),
    value: types.union(types.undefined, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class TransferModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get timestamp() { return this.__attr(`timestamp`) }
  get value() { return this.__attr(`value`) }
  transaction(builder?: string | TransactionModelSelector | ((selector: TransactionModelSelector) => TransactionModelSelector)) { return this.__child(`transaction`, TransactionModelSelector, builder) }
  token(builder?: string | TokenModelSelector | ((selector: TokenModelSelector) => TokenModelSelector)) { return this.__child(`token`, TokenModelSelector, builder) }
  operator(builder?: string | AccountModelSelector | ((selector: AccountModelSelector) => AccountModelSelector)) { return this.__child(`operator`, AccountModelSelector, builder) }
  from(builder?: string | AccountModelSelector | ((selector: AccountModelSelector) => AccountModelSelector)) { return this.__child(`from`, AccountModelSelector, builder) }
  fromBalance(builder?: string | BalanceModelSelector | ((selector: BalanceModelSelector) => BalanceModelSelector)) { return this.__child(`fromBalance`, BalanceModelSelector, builder) }
  to(builder?: string | AccountModelSelector | ((selector: AccountModelSelector) => AccountModelSelector)) { return this.__child(`to`, AccountModelSelector, builder) }
  toBalance(builder?: string | BalanceModelSelector | ((selector: BalanceModelSelector) => BalanceModelSelector)) { return this.__child(`toBalance`, BalanceModelSelector, builder) }
}
export function selectFromTransfer() {
  return new TransferModelSelector()
}

export const transferModelPrimitives = selectFromTransfer().timestamp.value
