/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { MSTGQLRef, QueryBuilder, withTypedRefs } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { AccountModel, AccountModelType } from "./AccountModel"
import { AccountModelSelector } from "./AccountModel.base"
import { TokenModel, TokenModelType } from "./TokenModel"
import { TokenModelSelector } from "./TokenModel.base"
import { TransactionModel, TransactionModelType } from "./TransactionModel"
import { TransactionModelSelector } from "./TransactionModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  transaction: TransactionModelType;
  token: TokenModelType;
  owner: AccountModelType;
  spender: AccountModelType;
}

/**
 * ApprovalBase
 * auto generated base class for the model ApprovalModel.
 */
export const ApprovalModelBase = withTypedRefs<Refs>()(ModelBase
  .named('Approval')
  .props({
    __typename: types.optional(types.literal("Approval"), "Approval"),
    id: types.identifier,
    transaction: types.union(types.undefined, MSTGQLRef(types.late((): any => TransactionModel))),
    timestamp: types.union(types.undefined, types.frozen()),
    token: types.union(types.undefined, MSTGQLRef(types.late((): any => TokenModel))),
    owner: types.union(types.undefined, MSTGQLRef(types.late((): any => AccountModel))),
    spender: types.union(types.undefined, MSTGQLRef(types.late((): any => AccountModel))),
    value: types.union(types.undefined, types.frozen()),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class ApprovalModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get timestamp() { return this.__attr(`timestamp`) }
  get value() { return this.__attr(`value`) }
  transaction(builder?: string | TransactionModelSelector | ((selector: TransactionModelSelector) => TransactionModelSelector)) { return this.__child(`transaction`, TransactionModelSelector, builder) }
  token(builder?: string | TokenModelSelector | ((selector: TokenModelSelector) => TokenModelSelector)) { return this.__child(`token`, TokenModelSelector, builder) }
  owner(builder?: string | AccountModelSelector | ((selector: AccountModelSelector) => AccountModelSelector)) { return this.__child(`owner`, AccountModelSelector, builder) }
  spender(builder?: string | AccountModelSelector | ((selector: AccountModelSelector) => AccountModelSelector)) { return this.__child(`spender`, AccountModelSelector, builder) }
}
export function selectFromApproval() {
  return new ApprovalModelSelector()
}

export const approvalModelPrimitives = selectFromApproval().timestamp.value
