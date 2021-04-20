/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from 'mobx-state-tree';

/**
 * Typescript enum
 */

export enum ApprovalOrderBy {
  id = 'id',
  transaction = 'transaction',
  timestamp = 'timestamp',
  token = 'token',
  owner = 'owner',
  spender = 'spender',
  value = 'value',
}

/**
 * ApprovalOrderBy
 */
export const ApprovalOrderByEnumType = types.enumeration('ApprovalOrderBy', [
  'id',
  'transaction',
  'timestamp',
  'token',
  'owner',
  'spender',
  'value',
]);
