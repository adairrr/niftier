/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum AccountOrderBy {
  id="id",
balances="balances",
transfersOperator="transfersOperator",
transfersFrom="transfersFrom",
transfersTo="transfersTo",
approvalsOwner="approvalsOwner",
approvalsSpender="approvalsSpender"
}

/**
* AccountOrderBy
*/
export const AccountOrderByEnumType = types.enumeration("AccountOrderBy", [
        "id",
  "balances",
  "transfersOperator",
  "transfersFrom",
  "transfersTo",
  "approvalsOwner",
  "approvalsSpender",
      ])
