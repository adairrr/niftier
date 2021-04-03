import { Instance, types } from "mobx-state-tree"
import { AccountModelType, BalanceModel } from ".";
import { RootStoreBase, BalanceFilter } from './RootStore.base';
import { Query } from 'mst-gql';
import { selectFromAccount } from './AccountModel.base';
import { selectFromBalance } from './BalanceModel.base';

export interface RootStoreType extends Instance<typeof RootStore.Type> {}

export const BALANCE_FRAGMENT = selectFromBalance()
  .id
  .token(token => token.uri)
  .toString();
  


export const RootStore = RootStoreBase
.props({
  // The store itself does store balances in loading order,
  // so we use an additional collection of references, to preserve the order as
  // it should be, regardless whether we are loading new or old balances.
  sortedBalances: types.optional(types.array(types.reference(BalanceModel)), [])
})
.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self))
  },
  loadBalances(accountId: string, skip: number, first: number) {
    const where: BalanceFilter = { account: accountId, value_gt: 0 };
    const query = self.queryBalances(
      { skip: skip, where: where, first: first },
      BALANCE_FRAGMENT
    );

    query.then((data) => {
      self.sortedBalances.push(...data.balances)
    });
    return query
  },
  queryAccountBalance(id: string): Query<{account: AccountModelType}> {
    return self.queryAccount(
      { id: id },
      `
      id
      __typename
      balances {
        id
        __typename
        token {
          id
          __typename
          tokenType {
            id
            __typename
            name
          }
          uri

        }
        value
      }
      `
    );
  }
}))
.actions(self => ({
  loadInitialBalances(accountId: string) {
    return self.loadBalances(accountId, 0, 16);
  },
  loadMoreBalances(accountId: string) {
    return self.loadBalances(accountId, self.sortedBalances.length, 16);
  }
}))
