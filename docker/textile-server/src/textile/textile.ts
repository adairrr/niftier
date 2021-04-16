import { PubSub } from 'apollo-server'
import { Client, CollectionConfig, PrivateKey, ThreadID } from '@textile/hub'
import * as dotenv from "dotenv";

dotenv.config()

export default class Textile {
  private static instance: Textile

  private static async initInstance(create = false) {
    const identity = PrivateKey.fromString(process.env.APP_IDENTITY || '')
    const client = await Client.withKeyInfo({
      key: process.env.APP_API_KEY || '',
      secret: process.env.APP_API_SECRET || ''
    })
    await client.getToken(identity)

    const threadId = await this.createThreadIfNotExists(client)
    const collections = (await client.listCollections(threadId)).map((x) => x.name)
    this.instance = new Textile(client, threadId, collections, new PubSub(), create)
  }

  private static async createThreadIfNotExists(client: Client) {
    const threadName = process.env.APP_THREAD_NAME || 'nifter-textile-thread'
    let thread
    try {
      thread = await client.getThread(threadName)
    } catch (e) {
      await client.newDB(ThreadID.fromRandom(), threadName)
      thread = await client.getThread(threadName)
    }
    // print out the links
    const threadId = ThreadID.fromString(thread.id);
    console.log(await client.getDBInfo(threadId));
    return threadId;
  }

  static async Instance(create = false) {
    if (!this.instance) {
      await Textile.initInstance(create)
    }
    return this.instance
  }

  client: Client
  private threadId: ThreadID
  private collections: string[]
  private pubSub: PubSub

  private constructor(client: Client, threadId: ThreadID, collections: string[], pubSub: PubSub, create = false) {
    this.client = client
    this.threadId = threadId
    this.collections = collections
    this.pubSub = pubSub

    if (!create) setTimeout(() => this.hackRefreshCredentials(), 120 * 1000)
  }

  hackRefreshCredentials() {
    Client.withKeyInfo({
      key: process.env.APP_API_KEY || '',
      secret: process.env.APP_API_SECRET || ''
    }).then(async (client) => {
      this.client = client
      const identity = PrivateKey.fromString(process.env.APP_IDENTITY || '')
      await client.getToken(identity)
    })
    setTimeout(() => this.hackRefreshCredentials(), 120 * 1000)
  }

  getRepository<T extends new (name: string, textile: Textile, threadID: ThreadID, pubSub: PubSub) => InstanceType<T>>(
    constructor: T,
    name: string
  ) {
    return new constructor(name, this, this.threadId, this.pubSub)
  }

  async newCollection(collectionConfig: CollectionConfig) {
    console.log(
      `create new collection ${collectionConfig.name} with schema:`,
      JSON.stringify(collectionConfig.schema, null, 2)
    )
    if (!this.collections.some((x) => x === collectionConfig.name)) {
      await this.client.newCollection(this.threadId, collectionConfig)
      this.collections = (await this.client.listCollections(this.threadId)).map((x) => x.name)
    }
  }

  async reset(hardReset = false) {
    console.log('Reset of old threadDB')

    if (hardReset) {
      console.log('thread delete started')
      await this.client.deleteDB(this.threadId)
      console.log('thread deleted')
      await Textile.initInstance()
      console.log('thread recreated')
    } else {
      for (let c of this.collections) {
        console.log(`truncate ${c}`)
        const ids = (await this.client.find(this.threadId, c, {})) as string[]
        await this.client.delete(this.threadId, c, ids)
        console.log(`delete collection ${c}`)
        await this.client.deleteCollection(this.threadId, c)
        console.log(`truncate ${c} done`)
      }
    }
    this.collections = []
    return await Textile.Instance(true)
  }
}
