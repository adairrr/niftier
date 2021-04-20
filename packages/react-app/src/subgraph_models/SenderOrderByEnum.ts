/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from 'mobx-state-tree';

/**
 * Typescript enum
 */

export enum SenderOrderBy {
  id = 'id',
  address = 'address',
  purposes = 'purposes',
  createdAt = 'createdAt',
  purposeCount = 'purposeCount',
}

/**
 * SenderOrderBy
 */
export const SenderOrderByEnumType = types.enumeration('SenderOrderBy', [
  'id',
  'address',
  'purposes',
  'createdAt',
  'purposeCount',
]);
