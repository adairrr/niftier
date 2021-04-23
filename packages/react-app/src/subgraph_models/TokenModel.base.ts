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
import { TokenRegistryModel, TokenRegistryModelType } from "./TokenRegistryModel"
import { TokenRegistryModelSelector } from "./TokenRegistryModel.base"
import { TokenRelationshipModel, TokenRelationshipModelType } from "./TokenRelationshipModel"
import { TokenRelationshipModelSelector } from "./TokenRelationshipModel.base"
import { TokenTypeModel, TokenTypeModelType } from "./TokenTypeModel"
import { TokenTypeModelSelector } from "./TokenTypeModel.base"
import { TransferModel, TransferModelType } from "./TransferModel"
import { TransferModelSelector } from "./TransferModel.base"
import { RootStoreType } from "./index"


/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  registry: TokenRegistryModelType;
  tokenType: TokenTypeModelType;
  children: IObservableArray<TokenRelationshipModelType>;
  parents: IObservableArray<TokenRelationshipModelType>;
  balances: IObservableArray<BalanceModelType>;
  transfers: IObservableArray<TransferModelType>;
  approvals: IObservableArray<ApprovalModelType>;
}

/**
 * TokenBase
 * auto generated base class for the model TokenModel.
 */
export const TokenModelBase = withTypedRefs<Refs>()(ModelBase
  .named('Token')
  .props({
    __typename: types.optional(types.literal("Token"), "Token"),
    id: types.identifier,
    registry: types.union(types.undefined, MSTGQLRef(types.late((): any => TokenRegistryModel))),
    identifier: types.union(types.undefined, types.frozen()),
    uri: types.union(types.undefined, types.null, types.string),
    totalSupply: types.union(types.undefined, types.frozen()),
    tokenType: types.union(types.undefined, MSTGQLRef(types.late((): any => TokenTypeModel))),
    children: types.union(types.undefined, types.null, types.array(MSTGQLRef(types.late((): any => TokenRelationshipModel)))),
    parents: types.union(types.undefined, types.null, types.array(MSTGQLRef(types.late((): any => TokenRelationshipModel)))),
    balances: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => BalanceModel)))),
    transfers: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => TransferModel)))),
    approvals: types.union(types.undefined, types.array(MSTGQLRef(types.late((): any => ApprovalModel)))),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  })))

export class TokenModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get identifier() { return this.__attr(`identifier`) }
  get uri() { return this.__attr(`uri`) }
  get totalSupply() { return this.__attr(`totalSupply`) }
  registry(builder?: string | TokenRegistryModelSelector | ((selector: TokenRegistryModelSelector) => TokenRegistryModelSelector)) { return this.__child(`registry`, TokenRegistryModelSelector, builder) }
  tokenType(builder?: string | TokenTypeModelSelector | ((selector: TokenTypeModelSelector) => TokenTypeModelSelector)) { return this.__child(`tokenType`, TokenTypeModelSelector, builder) }
  children(builder?: string | TokenRelationshipModelSelector | ((selector: TokenRelationshipModelSelector) => TokenRelationshipModelSelector)) { return this.__child(`children`, TokenRelationshipModelSelector, builder) }
  parents(builder?: string | TokenRelationshipModelSelector | ((selector: TokenRelationshipModelSelector) => TokenRelationshipModelSelector)) { return this.__child(`parents`, TokenRelationshipModelSelector, builder) }
  balances(builder?: string | BalanceModelSelector | ((selector: BalanceModelSelector) => BalanceModelSelector)) { return this.__child(`balances`, BalanceModelSelector, builder) }
  transfers(builder?: string | TransferModelSelector | ((selector: TransferModelSelector) => TransferModelSelector)) { return this.__child(`transfers`, TransferModelSelector, builder) }
  approvals(builder?: string | ApprovalModelSelector | ((selector: ApprovalModelSelector) => ApprovalModelSelector)) { return this.__child(`approvals`, ApprovalModelSelector, builder) }
}
export function selectFromToken() {
  return new TokenModelSelector()
}

export const tokenModelPrimitives = selectFromToken().identifier.uri.totalSupply
