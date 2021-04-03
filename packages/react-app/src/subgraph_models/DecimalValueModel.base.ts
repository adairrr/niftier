/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { QueryBuilder } from "mst-gql"
import { ModelBase } from "./ModelBase"
import { RootStoreType } from "./index"


/**
 * DecimalValueBase
 * auto generated base class for the model DecimalValueModel.
 */
export const DecimalValueModelBase = ModelBase
  .named('DecimalValue')
  .props({
    __typename: types.optional(types.literal("DecimalValue"), "DecimalValue"),
    id: types.identifier,
    value: types.union(types.undefined, types.frozen()),
    exact: types.union(types.undefined, types.frozen()),
    decimals: types.union(types.undefined, types.integer),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class DecimalValueModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get value() { return this.__attr(`value`) }
  get exact() { return this.__attr(`exact`) }
  get decimals() { return this.__attr(`decimals`) }
}
export function selectFromDecimalValue() {
  return new DecimalValueModelSelector()
}

export const decimalValueModelPrimitives = selectFromDecimalValue().value.exact.decimals
