/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum BalanceOrderBy {
  id="id",
token="token",
account="account",
value="value",
transfersFrom="transfersFrom",
transfersTo="transfersTo"
}

/**
* BalanceOrderBy
*/
export const BalanceOrderByEnumType = types.enumeration("BalanceOrderBy", [
        "id",
  "token",
  "account",
  "value",
  "transfersFrom",
  "transfersTo",
      ])
