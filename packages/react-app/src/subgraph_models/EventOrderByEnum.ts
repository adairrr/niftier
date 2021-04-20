/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from 'mobx-state-tree';

/**
 * Typescript enum
 */

export enum EventOrderBy {
  id = 'id',
  transaction = 'transaction',
  timestamp = 'timestamp',
}

/**
 * EventOrderBy
 */
export const EventOrderByEnumType = types.enumeration('EventOrderBy', ['id', 'transaction', 'timestamp']);
