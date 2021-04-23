/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { AccountModel, AccountModelType } from "./AccountModel"
import { AccountModelSelector } from "./AccountModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  account: AccountModelType;
}

/**
 * AccountDataBase
 * auto generated base class for the model AccountDataModel.
 */
export const AccountDataModelBase = withTypedRefs<Refs>()(ModelBase
  .named('AccountData')
  .props({
    __typename: types.optional(types.literal("AccountData"), "AccountData"),
    _id: types.union(types.undefined, types.string),
    id: types.union(types.undefined, types.string),
    did: types.union(types.undefined, types.null, types.string),
    account: types.union(types.undefined, types.null, MSTGQLRef(types.late((): any => AccountModel))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class AccountDataModelSelector extends QueryBuilder {
  get _id() { return this.__attr(`_id`) }
  get id() { return this.__attr(`id`) }
  get did() { return this.__attr(`did`) }
  account(builder?: string | AccountModelSelector | ((selector: AccountModelSelector) => AccountModelSelector)) { return this.__child(`account`, AccountModelSelector, builder) }
}
export function selectFromAccountData() {
  return new AccountDataModelSelector()
}

export const accountDataModelPrimitives = selectFromAccountData()._id.did
