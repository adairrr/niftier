import { PubSub } from 'apollo-server'
import { ThreadID, Where } from '@textile/hub'
import { v4 as uuid } from 'uuid'
import Textile from '../textile'

interface TextileCollection {
  _id: string // textile id
  __typename?: string
}

export interface TPayload<T extends TextileCollection> {
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

  get camelCollectionName(): string {
    // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    const camelized = this.collectionName.replace(/[-_\s.]+(.)?/g, (_, c) => (
      c ? c.toUpperCase() : ''
    ));
    return camelized.substr(0, 1).toLowerCase() + camelized.substr(1);
  }

  get emptyTPayload(): TPayload<T> {
    return {
      [this.camelCollectionName]: null
    } as TPayload<T>;
  }

  async all(): Promise<T[]> {
    return await this.client.find<T>(this.threadId, this.collectionName, {})
  }

  async getByAttribute(attrib: string, attribValue: string | null | undefined): Promise<T[]> {
    if (!attribValue) return [];
    const attribQuery = new Where(attrib).eq(attribValue);

    return await this.client.find<T>(this.threadId, this.collectionName, attribQuery)
      .then((queryResult) => queryResult)
      .catch(() => []);
  }

  async getByTextileId(_id: string | null | undefined): Promise<T | null> {
    return _id
      ? (await this.client.has(this.threadId, this.collectionName, [_id]))
        ? await this.client.findByID<T>(this.threadId, this.collectionName, _id)
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

  async deleteByTextileId(_id: string): Promise<boolean> {
    return await this.client.delete(this.threadId, this.collectionName, [_id])
      .then(() => true)
      .catch(() => false);
  }

  async create(t: Omit<T, '_id' | '__typename'>): Promise<TPayload<T>> {
    const createdId = (await this.client.create(this.threadId, this.collectionName, [t]))[0];

    const returnData = {
      [this.camelCollectionName]: Object.assign(t, { _id: createdId }) as T
    } as TPayload<T>;
    return returnData;
  }

  async updateByTextileId(t: Omit<T, '__typename'>): Promise<TPayload<T>> {
    // TODO at least for accountData, this does an extra query
    const queryResult = await this.getByTextileId(t._id);
    // const queryResult = await this.client.findByID<T>(this.threadId, this.collectionName, t._id);

    // set the result to null by default
    const result = this.emptyTPayload;
    if (!queryResult) return result;

    // assign the passed in parameters to the TextileCollection
    Object.assign(queryResult, t);

    return await this.client.save(this.threadId, this.collectionName, [queryResult])
      .then(() => {
        result[this.camelCollectionName] = queryResult;
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
