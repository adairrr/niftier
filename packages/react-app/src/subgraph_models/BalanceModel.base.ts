/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { IObservableArray } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { AccountModel, AccountModelType } from "./AccountModel"
import { AccountModelSelector } from "./AccountModel.base"
import { TokenModel, TokenModelType } from "./TokenModel"
import { TokenModelSelector } from "./TokenModel.base"
import { TransferModel, TransferModelType } from "./TransferModel"
import { TransferModelSelector } from "./TransferModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  token: TokenModelType;
  account: AccountModelType;
  transfersFrom: IObservableArray<TransferModelType>;
  transfersTo: IObservableArray<TransferModelType>;
}

/**
 * BalanceBase
 * auto generated base class for the model BalanceModel.
 */
export const BalanceModelBase = withTypedRefs<Refs>()(ModelBase
  .named('Balance')
  .props({
    __typename: types.optional(types.literal("Balance"), "Balance"),
    id: types.identifier,
    token: types.union(types.undefined, MSTGQLRef(types.late((): any => TokenModel))),
    account: types.union(types.undefined, MSTGQLRef(types.late((): any => AccountModel))),
    value: types.union(types.undefined, types.frozen()),
    transfersFrom: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => TransferModel)))),
    transfersTo: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => TransferModel)))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class BalanceModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get value() { return this.__attr(`value`) }
  token(builder?: string | TokenModelSelector | ((selector: TokenModelSelector) => TokenModelSelector)) { return this.__child(`token`, TokenModelSelector, builder) }
  account(builder?: string | AccountModelSelector | ((selector: AccountModelSelector) => AccountModelSelector)) { return this.__child(`account`, AccountModelSelector, builder) }
  transfersFrom(builder?: string | TransferModelSelector | ((selector: TransferModelSelector) => TransferModelSelector)) { return this.__child(`transfersFrom`, TransferModelSelector, builder) }
  transfersTo(builder?: string | TransferModelSelector | ((selector: TransferModelSelector) => TransferModelSelector)) { return this.__child(`transfersTo`, TransferModelSelector, builder) }
}
export function selectFromBalance() {
  return new BalanceModelSelector()
}

export const balanceModelPrimitives = selectFromBalance().value
