/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum TokenOrderBy {
  id="id",
identifier="identifier",
uri="uri",
totalSupply="totalSupply",
tokenType="tokenType",
children="children",
parents="parents",
balances="balances",
transfers="transfers",
approvals="approvals"
}

/**
* TokenOrderBy
*/
export const TokenOrderByEnumType = types.enumeration("TokenOrderBy", [
        "id",
  "identifier",
  "uri",
  "totalSupply",
  "tokenType",
  "children",
  "parents",
  "balances",
  "transfers",
  "approvals",
      ])
