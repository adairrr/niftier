import waitOn from 'wait-on';
import { introspectSchema } from '@graphql-tools/wrap';
import { stitchSchemas } from '@graphql-tools/stitch';
import { delegateToSchema } from '@graphql-tools/delegate';
import { batchDelegateToSchema } from '@graphql-tools/batch-delegate';
import { makeRemoteExecutor, startServer } from './utils';
import * as dotenv from 'dotenv';
import getRemoteSchema from './utils/getRemoteSchema';
import { GraphQLObjectType } from 'graphql';

dotenv.config();

async function makeGatewaySchema() {
  // build executor functions for communicating with remote services

  // const subgraphExec = makeRemoteExecutor(<string>process.env.SUBGRAPH_URL, { log: true });
  // const textileExec = makeRemoteExecutor(<string>process.env.TEXTILE_URL, { log: true });
  // const subgraphSchema = await introspectSchema(subgraphExec);
  // const textileSchema = await introspectSchema(textileExec);

  const subgraphSchema = await getRemoteSchema(<string>process.env.SUBGRAPH_URL, { log: true });
  const textileSchema = await getRemoteSchema(<string>process.env.TEXTILE_URL, { log: true });
  
  return stitchSchemas({
    subschemas: [
      subgraphSchema,
      textileSchema
    ],
    typeDefs: `
      extend type Account {
        data: AccountData
      }
      extend type AccountData {
        account: Account
      }
    `,
    resolvers: {
      // TODO batching does not work properly yet
      
      // Account: {
      //   data: {
      //     selectionSet: `{ id }`,
      //     resolve(account, _args, context, info) {
      //       return batchDelegateToSchema({
      //         schema: textileSchema,
      //         operation: 'query',
      //         fieldName: 'accountDatasByIds',
      //         key: account.id,
      //         argsFromKeys: (ids) => ({ ids }),
      //         valuesFromResults: (results, keys) => {
      //           let index = 0;
      //           return keys.map((key) => {
      //             if (index < results.length && results[index].id === key) {
      //               return results[index++];
      //             }
      //             return null;
      //           })
      //         },
      //         context,
      //         info,
      //       });
      //     }
      //   }
      // },
      // AccountData: {
      //   account: {
      //     selectionSet: `{ id }`,
      //     resolve(accountData, _args, context, info) {
      //       return batchDelegateToSchema({
      //         schema: subgraphSchema,
      //         operation: 'query',
      //         fieldName: 'accounts',
      //         key: accountData.id,
      //         argsFromKeys: (ids) => ({ ids }),
      //         valuesFromResults: (results, keys) => {
      //           console.log("RESULTS", JSON.stringify(results));
      //           console.log("KEYS", keys);
      //           let index = 0;
      //           return keys.map((key) => {
      //             // if (index < results.length && results[index].id === key) {
      //             //   return results[index++];
      //             // }
      //             return null;
      //           })
      //         },
      //         context,
      //         info,
      //       });
      //     }
      //   }
      // }
      
      Account: {
        data: {
          selectionSet: `{ id }`,
          resolve(account, args, context, info) {
            return delegateToSchema({
              schema: textileSchema,
              operation: 'query',
              fieldName: 'accountData',
              args: { id: account.id },
              context,
              info,
            });
          }
        }
      },
      AccountData: {
        account: {
          selectionSet: `{ id }`,
          resolve(accountData, args, context, info) {
            return delegateToSchema({
              schema: subgraphSchema,
              operation: 'query',
              fieldName: 'account',
              args: { id: accountData.id },
              context,
              info,
            });
          }
        }
      }
    }
  });
}

waitOn({ 
  resources: [
    `tcp:${<string>process.env.SUBGRAPH_PORT}`, 
    `tcp:${<string>process.env.TEXTILE_PORT}`
  ] 
}, async () => {
  startServer(await makeGatewaySchema(), 'gateway', parseInt(<string>process.env.STITCHED_PORT));
});
