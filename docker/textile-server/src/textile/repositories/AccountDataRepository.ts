import { AccountData } from '../../generated/resolvers-types'
import TextileRepository, { TPayload } from './TextileRepository'
import { ValidationError } from 'apollo-server';

export class AccountDataRepository extends TextileRepository<AccountData> {
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
  async getAccountDataById(id: string | null | undefined): Promise<AccountData | null> {
    return await this.getByAttribute('id', id)
      .then((queryResult) => {
        if (queryResult.length < 1) {
          return null;
        } else if (queryResult.length > 1) {
          // TODO possibly a merge?
          throw new Error(`Something is very wrong - there are multiple accountDatas with that id: '${id}'`);
        }
        return queryResult[0];
      })
      .catch(() => null);
  }

  async updateAccountData(accountData: Omit<AccountData, '_id' | '__typename'>): Promise<TPayload<AccountData>> {
    
    const queryResult = await this.getAccountDataById(accountData.id);

    if (!queryResult) return this.emptyTPayload;
    
    const accountDataWithId = Object.assign(accountData, { _id: queryResult._id });

    return this.updateByTextileId(accountDataWithId);
  }

  async createAccountData(accountData: Omit<AccountData, '_id' | '__typename'>): Promise<TPayload<AccountData>> {
    // check that the id has no whitespace
    if (accountData.id.indexOf(' ') >= 0) 
      throw new ValidationError(`AccountData id: '${accountData.id}' has invalid spaces`)
    
    // TODO should be able to set the index to unique using setUnique in generating the database somehow
    if (await this.getAccountDataById(accountData.id))
      throw new ValidationError(`AccountData id: '${accountData.id}' already exists`);

    return this.create(accountData);
  }
}
