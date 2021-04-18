import { loadSchema } from '@graphql-tools/load'
import { UrlLoader } from '@graphql-tools/url-loader'
import { wrapSchema } from '@graphql-tools/wrap'
import { GraphQLSchema, print } from 'graphql'
import { fetch } from 'cross-fetch'

interface RemoteSchemaOptions {
  log?: boolean
}

export default async(url: string, options: RemoteSchemaOptions = {}): Promise<GraphQLSchema> => {
  const typeDefs = await loadSchema(url, { loaders: [new UrlLoader()] });

  return wrapSchema({
    schema: typeDefs,
    executor: async ({ document, variables, context }) => {
      const query = typeof document === 'string' ? document : print(document)
      if (options.log) console.log(`# -- OPERATION ${new Date().toISOString()}:\n${query}`);

      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
      }).then(res => res.json())
    }
  })
}
