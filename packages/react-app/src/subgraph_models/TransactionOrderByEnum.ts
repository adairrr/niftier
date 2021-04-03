/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum TransactionOrderBy {
  id="id",
timestamp="timestamp",
blockNumber="blockNumber",
events="events"
}

/**
* TransactionOrderBy
*/
export const TransactionOrderByEnumType = types.enumeration("TransactionOrderBy", [
        "id",
  "timestamp",
  "blockNumber",
  "events",
      ])
