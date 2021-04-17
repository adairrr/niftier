import { PubSub } from 'apollo-server'
import { ThreadID, Where } from '@textile/hub'
import { v4 as uuid } from 'uuid'
import Textile from '../textile'

interface TextileCollection {
  _id: string
  __typename?: string
}

interface CreateUpdatePayload<T extends TextileCollection> {
  [collection: string]: T | null;
}

export default abstract class TextileRepository<T extends TextileCollection> {
  protected readonly collectionName: string
  protected readonly textile: Textile
  protected readonly threadId: ThreadID
  protected readonly pubSub: PubSub
  
  constructor(name: string, textile: Textile, threadID: ThreadID, pubSub: PubSub) {
    this.collectionName = name
    this.textile = textile
    this.threadId = threadID
    this.pubSub = pubSub
  }

  get client() {
    return this.textile.client
  }

  get lowerCollectionName(): string {
    return this.collectionName.toLowerCase();
  }

  async all() {
    return await this.client.find<T>(this.threadId, this.collectionName, {})
  }

  async getById(_id: string | null | undefined): Promise<T | null> {
    return _id
      ? (await this.client.has(this.threadId, this.collectionName, [_id]))
        ? await this.client.findByID(this.threadId, this.collectionName, _id)
        : null
      : null
  }

  async getMany(_ids: string[]): Promise<T[] | null> {
    return _ids
      ? await this.client.find<T>(this.threadId, this.collectionName, {
          ors: _ids.map((id) => {
            return { ands: [{ fieldPath: '_id', value: { string: id } }] }
          })
        })
      : null
  }

  async deleteById(_id: string): Promise<boolean> {
    try {
      await this.client.delete(this.threadId, this.collectionName, [_id])
      return true
    } catch {
      return false
    }
  }

  async create(t: Omit<T, '_id' | '__typename'>): Promise<CreateUpdatePayload<T>> {
    const createdId = (await this.client.create(this.threadId, this.collectionName, [t]))[0];

    return {
      [this.lowerCollectionName]: Object.assign(t, { _id: createdId }) as T
    } as CreateUpdatePayload<T>;
  }

  async update(t: Omit<T, '__typename'>): Promise<CreateUpdatePayload<T>> {
    const query = new Where('_id').eq(t._id);
    const queryResult = await this.client.find<T>(this.threadId, this.collectionName, query);

    // set the result to null by default
    const result = {
      [this.lowerCollectionName]: null
    } as CreateUpdatePayload<T>;

    if (queryResult.length < 1) return result;

    // assign the passed in parameters to the TextileCollection
    const updatedItem = queryResult[0];
    Object.assign(updatedItem, t);

    return await this.client.save(this.threadId, this.collectionName, [updatedItem])
      .then(() => {
        result[this.lowerCollectionName] = updatedItem;
        return result;
      })
      .catch(() => result);
  }

  private subscribe(filter: string) {
    const trigger = uuid()
    this.client.listen(this.threadId, [{ actionTypes: [filter], collectionName: this.collectionName }], (reply) =>
      this.pubSub.publish(trigger, reply?.instance)
    )
    return this.pubSub.asyncIterator(trigger)
  }

  private subscribeId(filter: string) {
    const trigger = uuid()
    this.client.listen(this.threadId, [{ actionTypes: [filter], collectionName: this.collectionName }], (reply) =>
      this.pubSub.publish(trigger, reply?.instanceID)
    )
    return this.pubSub.asyncIterator(trigger)
  }
  get subscribeCreate() {
    return this.subscribe('CREATE')
  }

  get subscribeDelete() {
    return this.subscribeId('DELETE')
  }

  get subscribeSave() {
    return this.subscribe('SAVE')
  }
}
