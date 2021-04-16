import { User } from '../../generated/resolvers-types'
import TextileRepository from './TextileRepository'
import { v4 as uuid } from 'uuid'

export class UserRepository extends TextileRepository<User> {
  // get subscribeVoted() {
  //   const trigger = uuid()
  //   this.client.listen<Vote>(
  //     this.threadId,
  //     [{ actionTypes: ['CREATE'], collectionName: 'Vote' }],
  //     async (reply) => { this.pubSub.publish(trigger, await this.getById(reply?.instance?.meme._id))}
  //     //TODO also DELETE 
  //   )
  //   return this.pubSub.asyncIterator(trigger)
  // }
}
