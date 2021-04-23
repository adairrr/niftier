/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { ObservableMap } from "mobx"
import { types } from "mobx-state-tree"
import { MSTGQLStore, configureStoreMixin, QueryOptions, withTypedRefs } from "mst-gql"

import { AccountModel, AccountModelType } from "./AccountModel"
import { accountModelPrimitives, AccountModelSelector } from "./AccountModel.base"
import { ApprovalModel, ApprovalModelType } from "./ApprovalModel"
import { approvalModelPrimitives, ApprovalModelSelector } from "./ApprovalModel.base"
import { BalanceModel, BalanceModelType } from "./BalanceModel"
import { balanceModelPrimitives, BalanceModelSelector } from "./BalanceModel.base"
import { DebugModel, DebugModelType } from "./DebugModel"
import { debugModelPrimitives, DebugModelSelector } from "./DebugModel.base"
import { DecimalValueModel, DecimalValueModelType } from "./DecimalValueModel"
import { decimalValueModelPrimitives, DecimalValueModelSelector } from "./DecimalValueModel.base"
import { PersistentStringModel, PersistentStringModelType } from "./PersistentStringModel"
import { persistentStringModelPrimitives, PersistentStringModelSelector } from "./PersistentStringModel.base"
import { PersistentStringArrayModel, PersistentStringArrayModelType } from "./PersistentStringArrayModel"
import { persistentStringArrayModelPrimitives, PersistentStringArrayModelSelector } from "./PersistentStringArrayModel.base"
import { PurposeModel, PurposeModelType } from "./PurposeModel"
import { purposeModelPrimitives, PurposeModelSelector } from "./PurposeModel.base"
import { SenderModel, SenderModelType } from "./SenderModel"
import { senderModelPrimitives, SenderModelSelector } from "./SenderModel.base"
import { TokenModel, TokenModelType } from "./TokenModel"
import { tokenModelPrimitives, TokenModelSelector } from "./TokenModel.base"
import { TokenRegistryModel, TokenRegistryModelType } from "./TokenRegistryModel"
import { tokenRegistryModelPrimitives, TokenRegistryModelSelector } from "./TokenRegistryModel.base"
import { TokenRelationshipModel, TokenRelationshipModelType } from "./TokenRelationshipModel"
import { tokenRelationshipModelPrimitives, TokenRelationshipModelSelector } from "./TokenRelationshipModel.base"
import { TokenTypeModel, TokenTypeModelType } from "./TokenTypeModel"
import { tokenTypeModelPrimitives, TokenTypeModelSelector } from "./TokenTypeModel.base"
import { TokenTypeRelationshipModel, TokenTypeRelationshipModelType } from "./TokenTypeRelationshipModel"
import { tokenTypeRelationshipModelPrimitives, TokenTypeRelationshipModelSelector } from "./TokenTypeRelationshipModel.base"
import { TransactionModel, TransactionModelType } from "./TransactionModel"
import { transactionModelPrimitives, TransactionModelSelector } from "./TransactionModel.base"
import { TransferModel, TransferModelType } from "./TransferModel"
import { transferModelPrimitives, TransferModelSelector } from "./TransferModel.base"
import { BlockModel, BlockModelType } from "./BlockModel"
import { blockModelPrimitives, BlockModelSelector } from "./BlockModel.base"
import { MetaModel, MetaModelType } from "./MetaModel"
import { metaModelPrimitives, MetaModelSelector } from "./MetaModel.base"
import { AccountDataModel, AccountDataModelType } from "./AccountDataModel"
import { accountDataModelPrimitives, AccountDataModelSelector } from "./AccountDataModel.base"
import { AccountDataPayloadModel, AccountDataPayloadModelType } from "./AccountDataPayloadModel"
import { accountDataPayloadModelPrimitives, AccountDataPayloadModelSelector } from "./AccountDataPayloadModel.base"

import { eventModelPrimitives, EventModelSelector , EventUnion } from "./"

import { AccountOrderBy } from "./AccountOrderByEnum"
import { ApprovalOrderBy } from "./ApprovalOrderByEnum"
import { BalanceOrderBy } from "./BalanceOrderByEnum"
import { DebugOrderBy } from "./DebugOrderByEnum"
import { DecimalValueOrderBy } from "./DecimalValueOrderByEnum"
import { EventOrderBy } from "./EventOrderByEnum"
import { OrderDirection } from "./OrderDirectionEnum"
import { PersistentStringArrayOrderBy } from "./PersistentStringArrayOrderByEnum"
import { PersistentStringOrderBy } from "./PersistentStringOrderByEnum"
import { PurposeOrderBy } from "./PurposeOrderByEnum"
import { SenderOrderBy } from "./SenderOrderByEnum"
import { TokenRegistryOrderBy } from "./TokenRegistryOrderByEnum"
import { TokenRelationshipOrderBy } from "./TokenRelationshipOrderByEnum"
import { TokenTypeRelationshipOrderBy } from "./TokenTypeRelationshipOrderByEnum"
import { TokenTypeOrderBy } from "./TokenTypeOrderByEnum"
import { TokenOrderBy } from "./TokenOrderByEnum"
import { TransactionOrderBy } from "./TransactionOrderByEnum"
import { TransferOrderBy } from "./TransferOrderByEnum"

export type AccountFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
}
export type ApprovalFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  transaction?: string
  transaction_not?: string
  transaction_gt?: string
  transaction_lt?: string
  transaction_gte?: string
  transaction_lte?: string
  transaction_in?: string[]
  transaction_not_in?: string[]
  transaction_contains?: string
  transaction_not_contains?: string
  transaction_starts_with?: string
  transaction_not_starts_with?: string
  transaction_ends_with?: string
  transaction_not_ends_with?: string
  timestamp?: any
  timestamp_not?: any
  timestamp_gt?: any
  timestamp_lt?: any
  timestamp_gte?: any
  timestamp_lte?: any
  timestamp_in?: any[]
  timestamp_not_in?: any[]
  token?: string
  token_not?: string
  token_gt?: string
  token_lt?: string
  token_gte?: string
  token_lte?: string
  token_in?: string[]
  token_not_in?: string[]
  token_contains?: string
  token_not_contains?: string
  token_starts_with?: string
  token_not_starts_with?: string
  token_ends_with?: string
  token_not_ends_with?: string
  owner?: string
  owner_not?: string
  owner_gt?: string
  owner_lt?: string
  owner_gte?: string
  owner_lte?: string
  owner_in?: string[]
  owner_not_in?: string[]
  owner_contains?: string
  owner_not_contains?: string
  owner_starts_with?: string
  owner_not_starts_with?: string
  owner_ends_with?: string
  owner_not_ends_with?: string
  spender?: string
  spender_not?: string
  spender_gt?: string
  spender_lt?: string
  spender_gte?: string
  spender_lte?: string
  spender_in?: string[]
  spender_not_in?: string[]
  spender_contains?: string
  spender_not_contains?: string
  spender_starts_with?: string
  spender_not_starts_with?: string
  spender_ends_with?: string
  spender_not_ends_with?: string
  value?: any
  value_not?: any
  value_gt?: any
  value_lt?: any
  value_gte?: any
  value_lte?: any
  value_in?: any[]
  value_not_in?: any[]
}
export type BalanceFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  token?: string
  token_not?: string
  token_gt?: string
  token_lt?: string
  token_gte?: string
  token_lte?: string
  token_in?: string[]
  token_not_in?: string[]
  token_contains?: string
  token_not_contains?: string
  token_starts_with?: string
  token_not_starts_with?: string
  token_ends_with?: string
  token_not_ends_with?: string
  account?: string
  account_not?: string
  account_gt?: string
  account_lt?: string
  account_gte?: string
  account_lte?: string
  account_in?: string[]
  account_not_in?: string[]
  account_contains?: string
  account_not_contains?: string
  account_starts_with?: string
  account_not_starts_with?: string
  account_ends_with?: string
  account_not_ends_with?: string
  value?: any
  value_not?: any
  value_gt?: any
  value_lt?: any
  value_gte?: any
  value_lte?: any
  value_in?: any[]
  value_not_in?: any[]
}
export type BlockHeight = {
  hash?: any
  number?: number
}
export type DebugFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  message?: string
  message_not?: string
  message_gt?: string
  message_lt?: string
  message_gte?: string
  message_lte?: string
  message_in?: string[]
  message_not_in?: string[]
  message_contains?: string
  message_not_contains?: string
  message_starts_with?: string
  message_not_starts_with?: string
  message_ends_with?: string
  message_not_ends_with?: string
}
export type DecimalValueFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  value?: any
  value_not?: any
  value_gt?: any
  value_lt?: any
  value_gte?: any
  value_lte?: any
  value_in?: any[]
  value_not_in?: any[]
  exact?: any
  exact_not?: any
  exact_gt?: any
  exact_lt?: any
  exact_gte?: any
  exact_lte?: any
  exact_in?: any[]
  exact_not_in?: any[]
  decimals?: number
  decimals_not?: number
  decimals_gt?: number
  decimals_lt?: number
  decimals_gte?: number
  decimals_lte?: number
  decimals_in?: number[]
  decimals_not_in?: number[]
}
export type EventFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  transaction?: string
  transaction_not?: string
  transaction_gt?: string
  transaction_lt?: string
  transaction_gte?: string
  transaction_lte?: string
  transaction_in?: string[]
  transaction_not_in?: string[]
  transaction_contains?: string
  transaction_not_contains?: string
  transaction_starts_with?: string
  transaction_not_starts_with?: string
  transaction_ends_with?: string
  transaction_not_ends_with?: string
  timestamp?: any
  timestamp_not?: any
  timestamp_gt?: any
  timestamp_lt?: any
  timestamp_gte?: any
  timestamp_lte?: any
  timestamp_in?: any[]
  timestamp_not_in?: any[]
}
export type PersistentStringArrayFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  values?: string[]
  values_not?: string[]
  values_contains?: string[]
  values_not_contains?: string[]
}
export type PersistentStringFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  value?: string
  value_not?: string
  value_gt?: string
  value_lt?: string
  value_gte?: string
  value_lte?: string
  value_in?: string[]
  value_not_in?: string[]
  value_contains?: string
  value_not_contains?: string
  value_starts_with?: string
  value_not_starts_with?: string
  value_ends_with?: string
  value_not_ends_with?: string
}
export type PurposeFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  sender?: string
  sender_not?: string
  sender_gt?: string
  sender_lt?: string
  sender_gte?: string
  sender_lte?: string
  sender_in?: string[]
  sender_not_in?: string[]
  sender_contains?: string
  sender_not_contains?: string
  sender_starts_with?: string
  sender_not_starts_with?: string
  sender_ends_with?: string
  sender_not_ends_with?: string
  purpose?: string
  purpose_not?: string
  purpose_gt?: string
  purpose_lt?: string
  purpose_gte?: string
  purpose_lte?: string
  purpose_in?: string[]
  purpose_not_in?: string[]
  purpose_contains?: string
  purpose_not_contains?: string
  purpose_starts_with?: string
  purpose_not_starts_with?: string
  purpose_ends_with?: string
  purpose_not_ends_with?: string
  createdAt?: any
  createdAt_not?: any
  createdAt_gt?: any
  createdAt_lt?: any
  createdAt_gte?: any
  createdAt_lte?: any
  createdAt_in?: any[]
  createdAt_not_in?: any[]
  transactionHash?: string
  transactionHash_not?: string
  transactionHash_gt?: string
  transactionHash_lt?: string
  transactionHash_gte?: string
  transactionHash_lte?: string
  transactionHash_in?: string[]
  transactionHash_not_in?: string[]
  transactionHash_contains?: string
  transactionHash_not_contains?: string
  transactionHash_starts_with?: string
  transactionHash_not_starts_with?: string
  transactionHash_ends_with?: string
  transactionHash_not_ends_with?: string
}
export type SenderFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  address?: any
  address_not?: any
  address_in?: any[]
  address_not_in?: any[]
  address_contains?: any
  address_not_contains?: any
  createdAt?: any
  createdAt_not?: any
  createdAt_gt?: any
  createdAt_lt?: any
  createdAt_gte?: any
  createdAt_lte?: any
  createdAt_in?: any[]
  createdAt_not_in?: any[]
  purposeCount?: any
  purposeCount_not?: any
  purposeCount_gt?: any
  purposeCount_lt?: any
  purposeCount_gte?: any
  purposeCount_lte?: any
  purposeCount_in?: any[]
  purposeCount_not_in?: any[]
}
export type TokenRegistryFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
}
export type TokenRelationshipFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  parent?: string
  parent_not?: string
  parent_gt?: string
  parent_lt?: string
  parent_gte?: string
  parent_lte?: string
  parent_in?: string[]
  parent_not_in?: string[]
  parent_contains?: string
  parent_not_contains?: string
  parent_starts_with?: string
  parent_not_starts_with?: string
  parent_ends_with?: string
  parent_not_ends_with?: string
  child?: string
  child_not?: string
  child_gt?: string
  child_lt?: string
  child_gte?: string
  child_lte?: string
  child_in?: string[]
  child_not_in?: string[]
  child_contains?: string
  child_not_contains?: string
  child_starts_with?: string
  child_not_starts_with?: string
  child_ends_with?: string
  child_not_ends_with?: string
}
export type TokenTypeRelationshipFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  parent?: string
  parent_not?: string
  parent_gt?: string
  parent_lt?: string
  parent_gte?: string
  parent_lte?: string
  parent_in?: string[]
  parent_not_in?: string[]
  parent_contains?: string
  parent_not_contains?: string
  parent_starts_with?: string
  parent_not_starts_with?: string
  parent_ends_with?: string
  parent_not_ends_with?: string
  child?: string
  child_not?: string
  child_gt?: string
  child_lt?: string
  child_gte?: string
  child_lte?: string
  child_in?: string[]
  child_not_in?: string[]
  child_contains?: string
  child_not_contains?: string
  child_starts_with?: string
  child_not_starts_with?: string
  child_ends_with?: string
  child_not_ends_with?: string
}
export type TokenTypeFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  name?: string
  name_not?: string
  name_gt?: string
  name_lt?: string
  name_gte?: string
  name_lte?: string
  name_in?: string[]
  name_not_in?: string[]
  name_contains?: string
  name_not_contains?: string
  name_starts_with?: string
  name_not_starts_with?: string
  name_ends_with?: string
  name_not_ends_with?: string
}
export type TokenFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  registry?: string
  registry_not?: string
  registry_gt?: string
  registry_lt?: string
  registry_gte?: string
  registry_lte?: string
  registry_in?: string[]
  registry_not_in?: string[]
  registry_contains?: string
  registry_not_contains?: string
  registry_starts_with?: string
  registry_not_starts_with?: string
  registry_ends_with?: string
  registry_not_ends_with?: string
  identifier?: any
  identifier_not?: any
  identifier_gt?: any
  identifier_lt?: any
  identifier_gte?: any
  identifier_lte?: any
  identifier_in?: any[]
  identifier_not_in?: any[]
  uri?: string
  uri_not?: string
  uri_gt?: string
  uri_lt?: string
  uri_gte?: string
  uri_lte?: string
  uri_in?: string[]
  uri_not_in?: string[]
  uri_contains?: string
  uri_not_contains?: string
  uri_starts_with?: string
  uri_not_starts_with?: string
  uri_ends_with?: string
  uri_not_ends_with?: string
  totalSupply?: any
  totalSupply_not?: any
  totalSupply_gt?: any
  totalSupply_lt?: any
  totalSupply_gte?: any
  totalSupply_lte?: any
  totalSupply_in?: any[]
  totalSupply_not_in?: any[]
  tokenType?: string
  tokenType_not?: string
  tokenType_gt?: string
  tokenType_lt?: string
  tokenType_gte?: string
  tokenType_lte?: string
  tokenType_in?: string[]
  tokenType_not_in?: string[]
  tokenType_contains?: string
  tokenType_not_contains?: string
  tokenType_starts_with?: string
  tokenType_not_starts_with?: string
  tokenType_ends_with?: string
  tokenType_not_ends_with?: string
}
export type TransactionFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  timestamp?: any
  timestamp_not?: any
  timestamp_gt?: any
  timestamp_lt?: any
  timestamp_gte?: any
  timestamp_lte?: any
  timestamp_in?: any[]
  timestamp_not_in?: any[]
  blockNumber?: any
  blockNumber_not?: any
  blockNumber_gt?: any
  blockNumber_lt?: any
  blockNumber_gte?: any
  blockNumber_lte?: any
  blockNumber_in?: any[]
  blockNumber_not_in?: any[]
}
export type TransferFilter = {
  id?: string
  id_not?: string
  id_gt?: string
  id_lt?: string
  id_gte?: string
  id_lte?: string
  id_in?: string[]
  id_not_in?: string[]
  transaction?: string
  transaction_not?: string
  transaction_gt?: string
  transaction_lt?: string
  transaction_gte?: string
  transaction_lte?: string
  transaction_in?: string[]
  transaction_not_in?: string[]
  transaction_contains?: string
  transaction_not_contains?: string
  transaction_starts_with?: string
  transaction_not_starts_with?: string
  transaction_ends_with?: string
  transaction_not_ends_with?: string
  timestamp?: any
  timestamp_not?: any
  timestamp_gt?: any
  timestamp_lt?: any
  timestamp_gte?: any
  timestamp_lte?: any
  timestamp_in?: any[]
  timestamp_not_in?: any[]
  token?: string
  token_not?: string
  token_gt?: string
  token_lt?: string
  token_gte?: string
  token_lte?: string
  token_in?: string[]
  token_not_in?: string[]
  token_contains?: string
  token_not_contains?: string
  token_starts_with?: string
  token_not_starts_with?: string
  token_ends_with?: string
  token_not_ends_with?: string
  operator?: string
  operator_not?: string
  operator_gt?: string
  operator_lt?: string
  operator_gte?: string
  operator_lte?: string
  operator_in?: string[]
  operator_not_in?: string[]
  operator_contains?: string
  operator_not_contains?: string
  operator_starts_with?: string
  operator_not_starts_with?: string
  operator_ends_with?: string
  operator_not_ends_with?: string
  from?: string
  from_not?: string
  from_gt?: string
  from_lt?: string
  from_gte?: string
  from_lte?: string
  from_in?: string[]
  from_not_in?: string[]
  from_contains?: string
  from_not_contains?: string
  from_starts_with?: string
  from_not_starts_with?: string
  from_ends_with?: string
  from_not_ends_with?: string
  fromBalance?: string
  fromBalance_not?: string
  fromBalance_gt?: string
  fromBalance_lt?: string
  fromBalance_gte?: string
  fromBalance_lte?: string
  fromBalance_in?: string[]
  fromBalance_not_in?: string[]
  fromBalance_contains?: string
  fromBalance_not_contains?: string
  fromBalance_starts_with?: string
  fromBalance_not_starts_with?: string
  fromBalance_ends_with?: string
  fromBalance_not_ends_with?: string
  to?: string
  to_not?: string
  to_gt?: string
  to_lt?: string
  to_gte?: string
  to_lte?: string
  to_in?: string[]
  to_not_in?: string[]
  to_contains?: string
  to_not_contains?: string
  to_starts_with?: string
  to_not_starts_with?: string
  to_ends_with?: string
  to_not_ends_with?: string
  toBalance?: string
  toBalance_not?: string
  toBalance_gt?: string
  toBalance_lt?: string
  toBalance_gte?: string
  toBalance_lte?: string
  toBalance_in?: string[]
  toBalance_not_in?: string[]
  toBalance_contains?: string
  toBalance_not_contains?: string
  toBalance_starts_with?: string
  toBalance_not_starts_with?: string
  toBalance_ends_with?: string
  toBalance_not_ends_with?: string
  value?: any
  value_not?: any
  value_gt?: any
  value_lt?: any
  value_gte?: any
  value_lte?: any
  value_in?: any[]
  value_not_in?: any[]
}
export type AccountDataCreateInput = {
  id: string
  did?: string
}
export type AccountDataUpdateInput = {
  id: string
  did?: string
}
/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
  accounts: ObservableMap<string, AccountModelType>,
  approvals: ObservableMap<string, ApprovalModelType>,
  balances: ObservableMap<string, BalanceModelType>,
  debugs: ObservableMap<string, DebugModelType>,
  decimalValues: ObservableMap<string, DecimalValueModelType>,
  persistentStrings: ObservableMap<string, PersistentStringModelType>,
  persistentStringArrays: ObservableMap<string, PersistentStringArrayModelType>,
  purposes: ObservableMap<string, PurposeModelType>,
  senders: ObservableMap<string, SenderModelType>,
  tokens: ObservableMap<string, TokenModelType>,
  tokenRegistries: ObservableMap<string, TokenRegistryModelType>,
  tokenRelationships: ObservableMap<string, TokenRelationshipModelType>,
  tokenTypes: ObservableMap<string, TokenTypeModelType>,
  tokenTypeRelationships: ObservableMap<string, TokenTypeRelationshipModelType>,
  transactions: ObservableMap<string, TransactionModelType>,
  transfers: ObservableMap<string, TransferModelType>
}


/**
* Enums for the names of base graphql actions
*/
export enum RootStoreBaseQueries {
queryPurpose="queryPurpose",
queryPurposes="queryPurposes",
querySender="querySender",
querySenders="querySenders",
queryDebug="queryDebug",
queryDebugs="queryDebugs",
queryAccount="queryAccount",
queryAccounts="queryAccounts",
queryTokenType="queryTokenType",
queryTokenTypes="queryTokenTypes",
queryTokenTypeRelationship="queryTokenTypeRelationship",
queryTokenTypeRelationships="queryTokenTypeRelationships",
queryTokenRegistry="queryTokenRegistry",
queryTokenRegistries="queryTokenRegistries",
queryToken="queryToken",
queryTokens="queryTokens",
queryTokenRelationship="queryTokenRelationship",
queryTokenRelationships="queryTokenRelationships",
queryBalance="queryBalance",
queryBalances="queryBalances",
queryTransaction="queryTransaction",
queryTransactions="queryTransactions",
queryTransfer="queryTransfer",
queryTransfers="queryTransfers",
queryApproval="queryApproval",
queryApprovals="queryApprovals",
queryDecimalValue="queryDecimalValue",
queryDecimalValues="queryDecimalValues",
queryPersistentStringArray="queryPersistentStringArray",
queryPersistentStringArrays="queryPersistentStringArrays",
queryPersistentString="queryPersistentString",
queryPersistentStrings="queryPersistentStrings",
queryEvent="queryEvent",
queryEvents="queryEvents",
query_meta="query_meta",
queryAccountData="queryAccountData",
queryAccountDatasByIds="queryAccountDatasByIds",
queryAccountDatas="queryAccountDatas"
}
export enum RootStoreBaseMutations {
mutateCreateAccountData="mutateCreateAccountData",
mutateUpdateAccountData="mutateUpdateAccountData",
mutateDeleteAccountData="mutateDeleteAccountData"
}

/**
* Store, managing, among others, all the objects received through graphQL
*/
export const RootStoreBase = withTypedRefs<Refs>()(MSTGQLStore
  .named("RootStore")
  .extend(configureStoreMixin([['Account', () => AccountModel], ['Approval', () => ApprovalModel], ['Balance', () => BalanceModel], ['Debug', () => DebugModel], ['DecimalValue', () => DecimalValueModel], ['PersistentString', () => PersistentStringModel], ['PersistentStringArray', () => PersistentStringArrayModel], ['Purpose', () => PurposeModel], ['Sender', () => SenderModel], ['Token', () => TokenModel], ['TokenRegistry', () => TokenRegistryModel], ['TokenRelationship', () => TokenRelationshipModel], ['TokenType', () => TokenTypeModel], ['TokenTypeRelationship', () => TokenTypeRelationshipModel], ['Transaction', () => TransactionModel], ['Transfer', () => TransferModel], ['_Block_', () => BlockModel], ['_Meta_', () => MetaModel], ['AccountData', () => AccountDataModel], ['AccountDataPayload', () => AccountDataPayloadModel]], ['Account', 'Approval', 'Balance', 'Debug', 'DecimalValue', 'PersistentString', 'PersistentStringArray', 'Purpose', 'Sender', 'Token', 'TokenRegistry', 'TokenRelationship', 'TokenType', 'TokenTypeRelationship', 'Transaction', 'Transfer'], "js"))
  .props({
    accounts: types.optional(types.map(types.late((): any => AccountModel)), {}),
    approvals: types.optional(types.map(types.late((): any => ApprovalModel)), {}),
    balances: types.optional(types.map(types.late((): any => BalanceModel)), {}),
    debugs: types.optional(types.map(types.late((): any => DebugModel)), {}),
    decimalValues: types.optional(types.map(types.late((): any => DecimalValueModel)), {}),
    persistentStrings: types.optional(types.map(types.late((): any => PersistentStringModel)), {}),
    persistentStringArrays: types.optional(types.map(types.late((): any => PersistentStringArrayModel)), {}),
    purposes: types.optional(types.map(types.late((): any => PurposeModel)), {}),
    senders: types.optional(types.map(types.late((): any => SenderModel)), {}),
    tokens: types.optional(types.map(types.late((): any => TokenModel)), {}),
    tokenRegistries: types.optional(types.map(types.late((): any => TokenRegistryModel)), {}),
    tokenRelationships: types.optional(types.map(types.late((): any => TokenRelationshipModel)), {}),
    tokenTypes: types.optional(types.map(types.late((): any => TokenTypeModel)), {}),
    tokenTypeRelationships: types.optional(types.map(types.late((): any => TokenTypeRelationshipModel)), {}),
    transactions: types.optional(types.map(types.late((): any => TransactionModel)), {}),
    transfers: types.optional(types.map(types.late((): any => TransferModel)), {})
  })
  .actions(self => ({
    queryPurpose(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: PurposeModelSelector) => PurposeModelSelector) = purposeModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ purpose: PurposeModelType}>(`query purpose($id: ID!, $block: Block_height) { purpose(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PurposeModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryPurposes(variables: { skip?: number, first?: number, orderBy?: PurposeOrderBy, orderDirection?: OrderDirection, where?: PurposeFilter, block?: BlockHeight }, resultSelector: string | ((qb: PurposeModelSelector) => PurposeModelSelector) = purposeModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ purposes: PurposeModelType[]}>(`query purposes($skip: Int, $first: Int, $orderBy: Purpose_orderBy, $orderDirection: OrderDirection, $where: Purpose_filter, $block: Block_height) { purposes(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PurposeModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    querySender(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: SenderModelSelector) => SenderModelSelector) = senderModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ sender: SenderModelType}>(`query sender($id: ID!, $block: Block_height) { sender(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new SenderModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    querySenders(variables: { skip?: number, first?: number, orderBy?: SenderOrderBy, orderDirection?: OrderDirection, where?: SenderFilter, block?: BlockHeight }, resultSelector: string | ((qb: SenderModelSelector) => SenderModelSelector) = senderModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ senders: SenderModelType[]}>(`query senders($skip: Int, $first: Int, $orderBy: Sender_orderBy, $orderDirection: OrderDirection, $where: Sender_filter, $block: Block_height) { senders(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new SenderModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryDebug(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: DebugModelSelector) => DebugModelSelector) = debugModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ debug: DebugModelType}>(`query debug($id: ID!, $block: Block_height) { debug(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new DebugModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryDebugs(variables: { skip?: number, first?: number, orderBy?: DebugOrderBy, orderDirection?: OrderDirection, where?: DebugFilter, block?: BlockHeight }, resultSelector: string | ((qb: DebugModelSelector) => DebugModelSelector) = debugModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ debugs: DebugModelType[]}>(`query debugs($skip: Int, $first: Int, $orderBy: Debug_orderBy, $orderDirection: OrderDirection, $where: Debug_filter, $block: Block_height) { debugs(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new DebugModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryAccount(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: AccountModelSelector) => AccountModelSelector) = accountModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ account: AccountModelType}>(`query account($id: ID!, $block: Block_height) { account(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new AccountModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryAccounts(variables: { skip?: number, first?: number, orderBy?: AccountOrderBy, orderDirection?: OrderDirection, where?: AccountFilter, block?: BlockHeight }, resultSelector: string | ((qb: AccountModelSelector) => AccountModelSelector) = accountModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ accounts: AccountModelType[]}>(`query accounts($skip: Int, $first: Int, $orderBy: Account_orderBy, $orderDirection: OrderDirection, $where: Account_filter, $block: Block_height) { accounts(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new AccountModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTokenType(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TokenTypeModelSelector) => TokenTypeModelSelector) = tokenTypeModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ tokenType: TokenTypeModelType}>(`query tokenType($id: ID!, $block: Block_height) { tokenType(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenTypeModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTokenTypes(variables: { skip?: number, first?: number, orderBy?: TokenTypeOrderBy, orderDirection?: OrderDirection, where?: TokenTypeFilter, block?: BlockHeight }, resultSelector: string | ((qb: TokenTypeModelSelector) => TokenTypeModelSelector) = tokenTypeModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ tokenTypes: TokenTypeModelType[]}>(`query tokenTypes($skip: Int, $first: Int, $orderBy: TokenType_orderBy, $orderDirection: OrderDirection, $where: TokenType_filter, $block: Block_height) { tokenTypes(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenTypeModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTokenTypeRelationship(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TokenTypeRelationshipModelSelector) => TokenTypeRelationshipModelSelector) = tokenTypeRelationshipModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ tokenTypeRelationship: TokenTypeRelationshipModelType}>(`query tokenTypeRelationship($id: ID!, $block: Block_height) { tokenTypeRelationship(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenTypeRelationshipModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTokenTypeRelationships(variables: { skip?: number, first?: number, orderBy?: TokenTypeRelationshipOrderBy, orderDirection?: OrderDirection, where?: TokenTypeRelationshipFilter, block?: BlockHeight }, resultSelector: string | ((qb: TokenTypeRelationshipModelSelector) => TokenTypeRelationshipModelSelector) = tokenTypeRelationshipModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ tokenTypeRelationships: TokenTypeRelationshipModelType[]}>(`query tokenTypeRelationships($skip: Int, $first: Int, $orderBy: TokenTypeRelationship_orderBy, $orderDirection: OrderDirection, $where: TokenTypeRelationship_filter, $block: Block_height) { tokenTypeRelationships(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenTypeRelationshipModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTokenRegistry(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TokenRegistryModelSelector) => TokenRegistryModelSelector) = tokenRegistryModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ tokenRegistry: TokenRegistryModelType}>(`query tokenRegistry($id: ID!, $block: Block_height) { tokenRegistry(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenRegistryModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTokenRegistries(variables: { skip?: number, first?: number, orderBy?: TokenRegistryOrderBy, orderDirection?: OrderDirection, where?: TokenRegistryFilter, block?: BlockHeight }, resultSelector: string | ((qb: TokenRegistryModelSelector) => TokenRegistryModelSelector) = tokenRegistryModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ tokenRegistries: TokenRegistryModelType[]}>(`query tokenRegistries($skip: Int, $first: Int, $orderBy: TokenRegistry_orderBy, $orderDirection: OrderDirection, $where: TokenRegistry_filter, $block: Block_height) { tokenRegistries(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenRegistryModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryToken(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TokenModelSelector) => TokenModelSelector) = tokenModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ token: TokenModelType}>(`query token($id: ID!, $block: Block_height) { token(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTokens(variables: { skip?: number, first?: number, orderBy?: TokenOrderBy, orderDirection?: OrderDirection, where?: TokenFilter, block?: BlockHeight }, resultSelector: string | ((qb: TokenModelSelector) => TokenModelSelector) = tokenModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ tokens: TokenModelType[]}>(`query tokens($skip: Int, $first: Int, $orderBy: Token_orderBy, $orderDirection: OrderDirection, $where: Token_filter, $block: Block_height) { tokens(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTokenRelationship(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TokenRelationshipModelSelector) => TokenRelationshipModelSelector) = tokenRelationshipModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ tokenRelationship: TokenRelationshipModelType}>(`query tokenRelationship($id: ID!, $block: Block_height) { tokenRelationship(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenRelationshipModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTokenRelationships(variables: { skip?: number, first?: number, orderBy?: TokenRelationshipOrderBy, orderDirection?: OrderDirection, where?: TokenRelationshipFilter, block?: BlockHeight }, resultSelector: string | ((qb: TokenRelationshipModelSelector) => TokenRelationshipModelSelector) = tokenRelationshipModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ tokenRelationships: TokenRelationshipModelType[]}>(`query tokenRelationships($skip: Int, $first: Int, $orderBy: TokenRelationship_orderBy, $orderDirection: OrderDirection, $where: TokenRelationship_filter, $block: Block_height) { tokenRelationships(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenRelationshipModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryBalance(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: BalanceModelSelector) => BalanceModelSelector) = balanceModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ balance: BalanceModelType}>(`query balance($id: ID!, $block: Block_height) { balance(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new BalanceModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryBalances(variables: { skip?: number, first?: number, orderBy?: BalanceOrderBy, orderDirection?: OrderDirection, where?: BalanceFilter, block?: BlockHeight }, resultSelector: string | ((qb: BalanceModelSelector) => BalanceModelSelector) = balanceModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ balances: BalanceModelType[]}>(`query balances($skip: Int, $first: Int, $orderBy: Balance_orderBy, $orderDirection: OrderDirection, $where: Balance_filter, $block: Block_height) { balances(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new BalanceModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTransaction(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TransactionModelSelector) => TransactionModelSelector) = transactionModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ transaction: TransactionModelType}>(`query transaction($id: ID!, $block: Block_height) { transaction(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TransactionModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTransactions(variables: { skip?: number, first?: number, orderBy?: TransactionOrderBy, orderDirection?: OrderDirection, where?: TransactionFilter, block?: BlockHeight }, resultSelector: string | ((qb: TransactionModelSelector) => TransactionModelSelector) = transactionModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ transactions: TransactionModelType[]}>(`query transactions($skip: Int, $first: Int, $orderBy: Transaction_orderBy, $orderDirection: OrderDirection, $where: Transaction_filter, $block: Block_height) { transactions(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TransactionModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTransfer(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TransferModelSelector) => TransferModelSelector) = transferModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ transfer: TransferModelType}>(`query transfer($id: ID!, $block: Block_height) { transfer(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TransferModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryTransfers(variables: { skip?: number, first?: number, orderBy?: TransferOrderBy, orderDirection?: OrderDirection, where?: TransferFilter, block?: BlockHeight }, resultSelector: string | ((qb: TransferModelSelector) => TransferModelSelector) = transferModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ transfers: TransferModelType[]}>(`query transfers($skip: Int, $first: Int, $orderBy: Transfer_orderBy, $orderDirection: OrderDirection, $where: Transfer_filter, $block: Block_height) { transfers(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TransferModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryApproval(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: ApprovalModelSelector) => ApprovalModelSelector) = approvalModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ approval: ApprovalModelType}>(`query approval($id: ID!, $block: Block_height) { approval(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new ApprovalModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryApprovals(variables: { skip?: number, first?: number, orderBy?: ApprovalOrderBy, orderDirection?: OrderDirection, where?: ApprovalFilter, block?: BlockHeight }, resultSelector: string | ((qb: ApprovalModelSelector) => ApprovalModelSelector) = approvalModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ approvals: ApprovalModelType[]}>(`query approvals($skip: Int, $first: Int, $orderBy: Approval_orderBy, $orderDirection: OrderDirection, $where: Approval_filter, $block: Block_height) { approvals(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new ApprovalModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryDecimalValue(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: DecimalValueModelSelector) => DecimalValueModelSelector) = decimalValueModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ decimalValue: DecimalValueModelType}>(`query decimalValue($id: ID!, $block: Block_height) { decimalValue(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new DecimalValueModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryDecimalValues(variables: { skip?: number, first?: number, orderBy?: DecimalValueOrderBy, orderDirection?: OrderDirection, where?: DecimalValueFilter, block?: BlockHeight }, resultSelector: string | ((qb: DecimalValueModelSelector) => DecimalValueModelSelector) = decimalValueModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ decimalValues: DecimalValueModelType[]}>(`query decimalValues($skip: Int, $first: Int, $orderBy: DecimalValue_orderBy, $orderDirection: OrderDirection, $where: DecimalValue_filter, $block: Block_height) { decimalValues(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new DecimalValueModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryPersistentStringArray(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: PersistentStringArrayModelSelector) => PersistentStringArrayModelSelector) = persistentStringArrayModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ persistentStringArray: PersistentStringArrayModelType}>(`query persistentStringArray($id: ID!, $block: Block_height) { persistentStringArray(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PersistentStringArrayModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryPersistentStringArrays(variables: { skip?: number, first?: number, orderBy?: PersistentStringArrayOrderBy, orderDirection?: OrderDirection, where?: PersistentStringArrayFilter, block?: BlockHeight }, resultSelector: string | ((qb: PersistentStringArrayModelSelector) => PersistentStringArrayModelSelector) = persistentStringArrayModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ persistentStringArrays: PersistentStringArrayModelType[]}>(`query persistentStringArrays($skip: Int, $first: Int, $orderBy: PersistentStringArray_orderBy, $orderDirection: OrderDirection, $where: PersistentStringArray_filter, $block: Block_height) { persistentStringArrays(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PersistentStringArrayModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryPersistentString(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: PersistentStringModelSelector) => PersistentStringModelSelector) = persistentStringModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ persistentString: PersistentStringModelType}>(`query persistentString($id: ID!, $block: Block_height) { persistentString(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PersistentStringModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryPersistentStrings(variables: { skip?: number, first?: number, orderBy?: PersistentStringOrderBy, orderDirection?: OrderDirection, where?: PersistentStringFilter, block?: BlockHeight }, resultSelector: string | ((qb: PersistentStringModelSelector) => PersistentStringModelSelector) = persistentStringModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ persistentStrings: PersistentStringModelType[]}>(`query persistentStrings($skip: Int, $first: Int, $orderBy: PersistentString_orderBy, $orderDirection: OrderDirection, $where: PersistentString_filter, $block: Block_height) { persistentStrings(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PersistentStringModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryEvent(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: EventModelSelector) => EventModelSelector) = eventModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ event: EventUnion}>(`query event($id: ID!, $block: Block_height) { event(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new EventModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryEvents(variables: { skip?: number, first?: number, orderBy?: EventOrderBy, orderDirection?: OrderDirection, where?: EventFilter, block?: BlockHeight }, resultSelector: string | ((qb: EventModelSelector) => EventModelSelector) = eventModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ events: EventUnion[]}>(`query events($skip: Int, $first: Int, $orderBy: Event_orderBy, $orderDirection: OrderDirection, $where: Event_filter, $block: Block_height) { events(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new EventModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    // Access to subgraph metadata
    query_meta(variables: { block?: BlockHeight }, resultSelector: string | ((qb: MetaModelSelector) => MetaModelSelector) = metaModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ _meta: MetaModelType}>(`query _meta($block: Block_height) { _meta(block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new MetaModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryAccountData(variables: { id: string }, resultSelector: string | ((qb: AccountDataModelSelector) => AccountDataModelSelector) = accountDataModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ accountData: AccountDataModelType}>(`query accountData($id: String!) { accountData(id: $id) {
        ${typeof resultSelector === "function" ? resultSelector(new AccountDataModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryAccountDatasByIds(variables: { ids: string[] }, resultSelector: string | ((qb: AccountDataModelSelector) => AccountDataModelSelector) = accountDataModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ accountDatasByIds: AccountDataModelType[]}>(`query accountDatasByIds($ids: [String!]!) { accountDatasByIds(ids: $ids) {
        ${typeof resultSelector === "function" ? resultSelector(new AccountDataModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    queryAccountDatas(variables?: {  }, resultSelector: string | ((qb: AccountDataModelSelector) => AccountDataModelSelector) = accountDataModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ accountDatas: AccountDataModelType[]}>(`query accountDatas { accountDatas {
        ${typeof resultSelector === "function" ? resultSelector(new AccountDataModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    mutateCreateAccountData(variables: { accountData: AccountDataCreateInput }, resultSelector: string | ((qb: AccountDataPayloadModelSelector) => AccountDataPayloadModelSelector) = accountDataPayloadModelPrimitives.toString(), optimisticUpdate?: () => void) {
      return self.mutate<{ createAccountData: AccountDataPayloadModelType}>(`mutation createAccountData($accountData: AccountDataCreateInput!) { createAccountData(accountData: $accountData) {
        ${typeof resultSelector === "function" ? resultSelector(new AccountDataPayloadModelSelector()).toString() : resultSelector}
      } }`, variables, optimisticUpdate)
    },
    mutateUpdateAccountData(variables: { accountData: AccountDataUpdateInput }, resultSelector: string | ((qb: AccountDataPayloadModelSelector) => AccountDataPayloadModelSelector) = accountDataPayloadModelPrimitives.toString(), optimisticUpdate?: () => void) {
      return self.mutate<{ updateAccountData: AccountDataPayloadModelType}>(`mutation updateAccountData($accountData: AccountDataUpdateInput!) { updateAccountData(accountData: $accountData) {
        ${typeof resultSelector === "function" ? resultSelector(new AccountDataPayloadModelSelector()).toString() : resultSelector}
      } }`, variables, optimisticUpdate)
    },
    mutateDeleteAccountData(variables: { id: string }, optimisticUpdate?: () => void) {
      return self.mutate<{ deleteAccountData: boolean }>(`mutation deleteAccountData($id: String!) { deleteAccountData(_id: $id) }`, variables, optimisticUpdate)
    },
    subscribePurpose(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: PurposeModelSelector) => PurposeModelSelector) = purposeModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ purpose: PurposeModelType}>(`subscription purpose($id: ID!, $block: Block_height) { purpose(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PurposeModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribePurposes(variables: { skip?: number, first?: number, orderBy?: PurposeOrderBy, orderDirection?: OrderDirection, where?: PurposeFilter, block?: BlockHeight }, resultSelector: string | ((qb: PurposeModelSelector) => PurposeModelSelector) = purposeModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ purposes: PurposeModelType[]}>(`subscription purposes($skip: Int, $first: Int, $orderBy: Purpose_orderBy, $orderDirection: OrderDirection, $where: Purpose_filter, $block: Block_height) { purposes(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PurposeModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeSender(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: SenderModelSelector) => SenderModelSelector) = senderModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ sender: SenderModelType}>(`subscription sender($id: ID!, $block: Block_height) { sender(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new SenderModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeSenders(variables: { skip?: number, first?: number, orderBy?: SenderOrderBy, orderDirection?: OrderDirection, where?: SenderFilter, block?: BlockHeight }, resultSelector: string | ((qb: SenderModelSelector) => SenderModelSelector) = senderModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ senders: SenderModelType[]}>(`subscription senders($skip: Int, $first: Int, $orderBy: Sender_orderBy, $orderDirection: OrderDirection, $where: Sender_filter, $block: Block_height) { senders(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new SenderModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeDebug(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: DebugModelSelector) => DebugModelSelector) = debugModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ debug: DebugModelType}>(`subscription debug($id: ID!, $block: Block_height) { debug(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new DebugModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeDebugs(variables: { skip?: number, first?: number, orderBy?: DebugOrderBy, orderDirection?: OrderDirection, where?: DebugFilter, block?: BlockHeight }, resultSelector: string | ((qb: DebugModelSelector) => DebugModelSelector) = debugModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ debugs: DebugModelType[]}>(`subscription debugs($skip: Int, $first: Int, $orderBy: Debug_orderBy, $orderDirection: OrderDirection, $where: Debug_filter, $block: Block_height) { debugs(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new DebugModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeAccount(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: AccountModelSelector) => AccountModelSelector) = accountModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ account: AccountModelType}>(`subscription account($id: ID!, $block: Block_height) { account(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new AccountModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeAccounts(variables: { skip?: number, first?: number, orderBy?: AccountOrderBy, orderDirection?: OrderDirection, where?: AccountFilter, block?: BlockHeight }, resultSelector: string | ((qb: AccountModelSelector) => AccountModelSelector) = accountModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ accounts: AccountModelType[]}>(`subscription accounts($skip: Int, $first: Int, $orderBy: Account_orderBy, $orderDirection: OrderDirection, $where: Account_filter, $block: Block_height) { accounts(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new AccountModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTokenType(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TokenTypeModelSelector) => TokenTypeModelSelector) = tokenTypeModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ tokenType: TokenTypeModelType}>(`subscription tokenType($id: ID!, $block: Block_height) { tokenType(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenTypeModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTokenTypes(variables: { skip?: number, first?: number, orderBy?: TokenTypeOrderBy, orderDirection?: OrderDirection, where?: TokenTypeFilter, block?: BlockHeight }, resultSelector: string | ((qb: TokenTypeModelSelector) => TokenTypeModelSelector) = tokenTypeModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ tokenTypes: TokenTypeModelType[]}>(`subscription tokenTypes($skip: Int, $first: Int, $orderBy: TokenType_orderBy, $orderDirection: OrderDirection, $where: TokenType_filter, $block: Block_height) { tokenTypes(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenTypeModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTokenTypeRelationship(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TokenTypeRelationshipModelSelector) => TokenTypeRelationshipModelSelector) = tokenTypeRelationshipModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ tokenTypeRelationship: TokenTypeRelationshipModelType}>(`subscription tokenTypeRelationship($id: ID!, $block: Block_height) { tokenTypeRelationship(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenTypeRelationshipModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTokenTypeRelationships(variables: { skip?: number, first?: number, orderBy?: TokenTypeRelationshipOrderBy, orderDirection?: OrderDirection, where?: TokenTypeRelationshipFilter, block?: BlockHeight }, resultSelector: string | ((qb: TokenTypeRelationshipModelSelector) => TokenTypeRelationshipModelSelector) = tokenTypeRelationshipModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ tokenTypeRelationships: TokenTypeRelationshipModelType[]}>(`subscription tokenTypeRelationships($skip: Int, $first: Int, $orderBy: TokenTypeRelationship_orderBy, $orderDirection: OrderDirection, $where: TokenTypeRelationship_filter, $block: Block_height) { tokenTypeRelationships(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenTypeRelationshipModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTokenRegistry(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TokenRegistryModelSelector) => TokenRegistryModelSelector) = tokenRegistryModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ tokenRegistry: TokenRegistryModelType}>(`subscription tokenRegistry($id: ID!, $block: Block_height) { tokenRegistry(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenRegistryModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTokenRegistries(variables: { skip?: number, first?: number, orderBy?: TokenRegistryOrderBy, orderDirection?: OrderDirection, where?: TokenRegistryFilter, block?: BlockHeight }, resultSelector: string | ((qb: TokenRegistryModelSelector) => TokenRegistryModelSelector) = tokenRegistryModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ tokenRegistries: TokenRegistryModelType[]}>(`subscription tokenRegistries($skip: Int, $first: Int, $orderBy: TokenRegistry_orderBy, $orderDirection: OrderDirection, $where: TokenRegistry_filter, $block: Block_height) { tokenRegistries(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenRegistryModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeToken(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TokenModelSelector) => TokenModelSelector) = tokenModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ token: TokenModelType}>(`subscription token($id: ID!, $block: Block_height) { token(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTokens(variables: { skip?: number, first?: number, orderBy?: TokenOrderBy, orderDirection?: OrderDirection, where?: TokenFilter, block?: BlockHeight }, resultSelector: string | ((qb: TokenModelSelector) => TokenModelSelector) = tokenModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ tokens: TokenModelType[]}>(`subscription tokens($skip: Int, $first: Int, $orderBy: Token_orderBy, $orderDirection: OrderDirection, $where: Token_filter, $block: Block_height) { tokens(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTokenRelationship(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TokenRelationshipModelSelector) => TokenRelationshipModelSelector) = tokenRelationshipModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ tokenRelationship: TokenRelationshipModelType}>(`subscription tokenRelationship($id: ID!, $block: Block_height) { tokenRelationship(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenRelationshipModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTokenRelationships(variables: { skip?: number, first?: number, orderBy?: TokenRelationshipOrderBy, orderDirection?: OrderDirection, where?: TokenRelationshipFilter, block?: BlockHeight }, resultSelector: string | ((qb: TokenRelationshipModelSelector) => TokenRelationshipModelSelector) = tokenRelationshipModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ tokenRelationships: TokenRelationshipModelType[]}>(`subscription tokenRelationships($skip: Int, $first: Int, $orderBy: TokenRelationship_orderBy, $orderDirection: OrderDirection, $where: TokenRelationship_filter, $block: Block_height) { tokenRelationships(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TokenRelationshipModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeBalance(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: BalanceModelSelector) => BalanceModelSelector) = balanceModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ balance: BalanceModelType}>(`subscription balance($id: ID!, $block: Block_height) { balance(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new BalanceModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeBalances(variables: { skip?: number, first?: number, orderBy?: BalanceOrderBy, orderDirection?: OrderDirection, where?: BalanceFilter, block?: BlockHeight }, resultSelector: string | ((qb: BalanceModelSelector) => BalanceModelSelector) = balanceModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ balances: BalanceModelType[]}>(`subscription balances($skip: Int, $first: Int, $orderBy: Balance_orderBy, $orderDirection: OrderDirection, $where: Balance_filter, $block: Block_height) { balances(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new BalanceModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTransaction(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TransactionModelSelector) => TransactionModelSelector) = transactionModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ transaction: TransactionModelType}>(`subscription transaction($id: ID!, $block: Block_height) { transaction(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TransactionModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTransactions(variables: { skip?: number, first?: number, orderBy?: TransactionOrderBy, orderDirection?: OrderDirection, where?: TransactionFilter, block?: BlockHeight }, resultSelector: string | ((qb: TransactionModelSelector) => TransactionModelSelector) = transactionModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ transactions: TransactionModelType[]}>(`subscription transactions($skip: Int, $first: Int, $orderBy: Transaction_orderBy, $orderDirection: OrderDirection, $where: Transaction_filter, $block: Block_height) { transactions(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TransactionModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTransfer(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: TransferModelSelector) => TransferModelSelector) = transferModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ transfer: TransferModelType}>(`subscription transfer($id: ID!, $block: Block_height) { transfer(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TransferModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeTransfers(variables: { skip?: number, first?: number, orderBy?: TransferOrderBy, orderDirection?: OrderDirection, where?: TransferFilter, block?: BlockHeight }, resultSelector: string | ((qb: TransferModelSelector) => TransferModelSelector) = transferModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ transfers: TransferModelType[]}>(`subscription transfers($skip: Int, $first: Int, $orderBy: Transfer_orderBy, $orderDirection: OrderDirection, $where: Transfer_filter, $block: Block_height) { transfers(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new TransferModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeApproval(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: ApprovalModelSelector) => ApprovalModelSelector) = approvalModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ approval: ApprovalModelType}>(`subscription approval($id: ID!, $block: Block_height) { approval(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new ApprovalModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeApprovals(variables: { skip?: number, first?: number, orderBy?: ApprovalOrderBy, orderDirection?: OrderDirection, where?: ApprovalFilter, block?: BlockHeight }, resultSelector: string | ((qb: ApprovalModelSelector) => ApprovalModelSelector) = approvalModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ approvals: ApprovalModelType[]}>(`subscription approvals($skip: Int, $first: Int, $orderBy: Approval_orderBy, $orderDirection: OrderDirection, $where: Approval_filter, $block: Block_height) { approvals(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new ApprovalModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeDecimalValue(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: DecimalValueModelSelector) => DecimalValueModelSelector) = decimalValueModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ decimalValue: DecimalValueModelType}>(`subscription decimalValue($id: ID!, $block: Block_height) { decimalValue(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new DecimalValueModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeDecimalValues(variables: { skip?: number, first?: number, orderBy?: DecimalValueOrderBy, orderDirection?: OrderDirection, where?: DecimalValueFilter, block?: BlockHeight }, resultSelector: string | ((qb: DecimalValueModelSelector) => DecimalValueModelSelector) = decimalValueModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ decimalValues: DecimalValueModelType[]}>(`subscription decimalValues($skip: Int, $first: Int, $orderBy: DecimalValue_orderBy, $orderDirection: OrderDirection, $where: DecimalValue_filter, $block: Block_height) { decimalValues(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new DecimalValueModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribePersistentStringArray(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: PersistentStringArrayModelSelector) => PersistentStringArrayModelSelector) = persistentStringArrayModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ persistentStringArray: PersistentStringArrayModelType}>(`subscription persistentStringArray($id: ID!, $block: Block_height) { persistentStringArray(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PersistentStringArrayModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribePersistentStringArrays(variables: { skip?: number, first?: number, orderBy?: PersistentStringArrayOrderBy, orderDirection?: OrderDirection, where?: PersistentStringArrayFilter, block?: BlockHeight }, resultSelector: string | ((qb: PersistentStringArrayModelSelector) => PersistentStringArrayModelSelector) = persistentStringArrayModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ persistentStringArrays: PersistentStringArrayModelType[]}>(`subscription persistentStringArrays($skip: Int, $first: Int, $orderBy: PersistentStringArray_orderBy, $orderDirection: OrderDirection, $where: PersistentStringArray_filter, $block: Block_height) { persistentStringArrays(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PersistentStringArrayModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribePersistentString(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: PersistentStringModelSelector) => PersistentStringModelSelector) = persistentStringModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ persistentString: PersistentStringModelType}>(`subscription persistentString($id: ID!, $block: Block_height) { persistentString(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PersistentStringModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribePersistentStrings(variables: { skip?: number, first?: number, orderBy?: PersistentStringOrderBy, orderDirection?: OrderDirection, where?: PersistentStringFilter, block?: BlockHeight }, resultSelector: string | ((qb: PersistentStringModelSelector) => PersistentStringModelSelector) = persistentStringModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ persistentStrings: PersistentStringModelType[]}>(`subscription persistentStrings($skip: Int, $first: Int, $orderBy: PersistentString_orderBy, $orderDirection: OrderDirection, $where: PersistentString_filter, $block: Block_height) { persistentStrings(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new PersistentStringModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeEvent(variables: { id: string, block?: BlockHeight }, resultSelector: string | ((qb: EventModelSelector) => EventModelSelector) = eventModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ event: EventUnion}>(`subscription event($id: ID!, $block: Block_height) { event(id: $id, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new EventModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeEvents(variables: { skip?: number, first?: number, orderBy?: EventOrderBy, orderDirection?: OrderDirection, where?: EventFilter, block?: BlockHeight }, resultSelector: string | ((qb: EventModelSelector) => EventModelSelector) = eventModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ events: EventUnion[]}>(`subscription events($skip: Int, $first: Int, $orderBy: Event_orderBy, $orderDirection: OrderDirection, $where: Event_filter, $block: Block_height) { events(skip: $skip, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: $where, block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new EventModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    // Access to subgraph metadata
    subscribe_meta(variables: { block?: BlockHeight }, resultSelector: string | ((qb: MetaModelSelector) => MetaModelSelector) = metaModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ _meta: MetaModelType}>(`subscription _meta($block: Block_height) { _meta(block: $block) {
        ${typeof resultSelector === "function" ? resultSelector(new MetaModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeAccountDataAdded(variables?: {  }, resultSelector: string | ((qb: AccountDataModelSelector) => AccountDataModelSelector) = accountDataModelPrimitives.toString(), onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ accountDataAdded: AccountDataModelType}>(`subscription accountDataAdded { accountDataAdded {
        ${typeof resultSelector === "function" ? resultSelector(new AccountDataModelSelector()).toString() : resultSelector}
      } }`, variables, onData, onError)
    },
    subscribeAccountDataDeleted(variables?: {  }, onData?: (item: any) => void, onError?: (error: Error) => void) {
      return self.subscribe<{ accountDataDeleted: string }>(`subscription accountDataDeleted { accountDataDeleted }`, variables, onData, onError)
    },
  })))
