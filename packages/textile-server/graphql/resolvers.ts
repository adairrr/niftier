import { Resolvers, User } from '../generated/resolvers-types'
import { ResolverContext } from './resolverContext'

const resolvers: Resolvers<ResolverContext> = {
  Query: {
    users: async (_p, _a, c) => await c.User.all()
  },
  Mutation: {
    createUser: async (_p, a, c) => await c.User.create(a.user),
    deleteUser: async (_p, args, c) => c.User.deleteById(args.id),
  },
  Subscription: {
    userAdded: {
      subscribe: (_p, _a, c) => c.User.subscribeCreate,
      resolve: (v: User) => v
    },
    userDeleted: {
      subscribe: (_p, _a, c) => c.User.subscribeDelete,
      resolve: (v: string) => v
    },
  },
  User: {
    // memes: async (p, _a, c) => (await c.Meme.all()).filter((x) => x.owner?._id === p._id),
    // votes: async (p, _a, c) => (await c.Vote.all()).filter((x) => x.user._id === p._id)
  }
}
export default resolvers;
