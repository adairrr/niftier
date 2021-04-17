import { Resolvers, User } from '../generated/resolvers-types'
import { ResolverContext } from './resolverContext'

const resolvers: Resolvers<ResolverContext> = {
  Query: {
    users: async (_p, _a, cx) => await cx.User.all()
  },
  Mutation: {
    createUser: async (_p, args, cx) => await cx.User.create(args.user),
    deleteUser: async (_p, args, cx) => cx.User.deleteById(args._id),
    updateUser: async (_p, args, cx ) => cx.User.update(args.user),
  },
  Subscription: {
    userAdded: {
      subscribe: (_p, _a, cx) => cx.User.subscribeCreate,
      resolve: (v: User) => v
    },
    userDeleted: {
      subscribe: (_p, _a, cx) => cx.User.subscribeDelete,
      resolve: (v: string) => v
    },
  },
  User: {
    // memes: async (p, _a, c) => (await c.Meme.all()).filter((x) => x.owner?._id === p._id),
    // votes: async (p, _a, c) => (await c.Vote.all()).filter((x) => x.user._id === p._id)
  }
}
export default resolvers;
