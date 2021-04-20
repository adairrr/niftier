/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from 'mobx-state-tree';

/**
 * Typescript enum
 */

export enum PurposeOrderBy {
  id = 'id',
  sender = 'sender',
  purpose = 'purpose',
  createdAt = 'createdAt',
  transactionHash = 'transactionHash',
}

/**
 * PurposeOrderBy
 */
export const PurposeOrderByEnumType = types.enumeration('PurposeOrderBy', [
  'id',
  'sender',
  'purpose',
  'createdAt',
  'transactionHash',
]);
