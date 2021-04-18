import { Resolvers, AccountData } from '../generated/resolvers-types'
import { ResolverContext } from './resolverContext'

const resolvers: Resolvers<ResolverContext> = {
  Query: {
    accountData: async (_p, args, cx) => await cx.AccountData.getAccountDataById(args.id),
    accountDatasByIds: async (_p, args, cx) => await cx.AccountData.getAccountDatasByIds(args.ids),
    accountDatas: async (_p, args, cx) => await cx.AccountData.all(),
  },
  Mutation: {
    createAccountData: async (_p, args, cx) => await cx.AccountData.createAccountData(args.accountData),
    updateAccountData: async (_p, args, cx ) => cx.AccountData.updateAccountData(args.accountData),
    deleteAccountData: async (_p, args, cx) => cx.AccountData.deleteByTextileId(args._id),
  },
  Subscription: {
    accountDataAdded: {
      subscribe: (_p, args, cx) => cx.AccountData.subscribeCreate,
      resolve: (v: AccountData) => v
    },
    accountDataDeleted: {
      subscribe: (_p, args, cx) => cx.AccountData.subscribeDelete,
      resolve: (v: string) => v
    },
  },
  AccountData: {
    // memes: async (p, args, c) => (await c.Meme.all()).filter((x) => x.owner?._id === p._id),
    // votes: async (p, args, c) => (await c.Vote.all()).filter((x) => x.accountData._id === p._id)
  }
}
export default resolvers;
