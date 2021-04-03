/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum TokenTypeOrderBy {
  id="id",
name="name",
tokens="tokens",
authorizedChildren="authorizedChildren",
authorizedParents="authorizedParents"
}

/**
* TokenTypeOrderBy
*/
export const TokenTypeOrderByEnumType = types.enumeration("TokenTypeOrderBy", [
        "id",
  "name",
  "tokens",
  "authorizedChildren",
  "authorizedParents",
      ])
