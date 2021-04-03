/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum TransferOrderBy {
  id="id",
transaction="transaction",
timestamp="timestamp",
token="token",
operator="operator",
from="from",
fromBalance="fromBalance",
to="to",
toBalance="toBalance",
value="value"
}

/**
* TransferOrderBy
*/
export const TransferOrderByEnumType = types.enumeration("TransferOrderBy", [
        "id",
  "transaction",
  "timestamp",
  "token",
  "operator",
  "from",
  "fromBalance",
  "to",
  "toBalance",
  "value",
      ])
