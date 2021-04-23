/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { AccountDataModel, AccountDataModelType } from "./AccountDataModel"
import { AccountDataModelSelector } from "./AccountDataModel.base"
import { RootStoreType } from "./index"


/**
 * AccountDataPayloadBase
 * auto generated base class for the model AccountDataPayloadModel.
 */
export const AccountDataPayloadModelBase = ModelBase
  .named('AccountDataPayload')
  .props({
    __typename: types.optional(types.literal("AccountDataPayload"), "AccountDataPayload"),
    accountData: types.union(types.undefined, types.null, types.late((): any => AccountDataModel)),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class AccountDataPayloadModelSelector extends QueryBuilder {
  accountData(builder?: string | AccountDataModelSelector | ((selector: AccountDataModelSelector) => AccountDataModelSelector)) { return this.__child(`accountData`, AccountDataModelSelector, builder) }
}
export function selectFromAccountDataPayload() {
  return new AccountDataPayloadModelSelector()
}

export const accountDataPayloadModelPrimitives = selectFromAccountDataPayload()
