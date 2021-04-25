import waitOn from 'wait-on';
import { stitchSchemas } from '@graphql-tools/stitch';
import { batchDelegateToSchema } from '@graphql-tools/batch-delegate';
import { getRemoteSchema, startServer, transformIdIntoQuery, parseValuesFromResults } from './utils';
import * as dotenv from 'dotenv';
import { forwardArgsToSelectionSet } from '@graphql-tools/stitch';

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
      Account: {
        data: {
          selectionSet: forwardArgsToSelectionSet(`{ id }`),
          resolve(account, _args, context, info) {
            return batchDelegateToSchema({
              schema: textileSchema,
              operation: 'query',
              fieldName: 'accountDatasByIds',
              key: account.id,
              argsFromKeys: (ids) => ({ ids }),
              transforms: transformIdIntoQuery('accountDatasByIds'),
              valuesFromResults: parseValuesFromResults(),
              context,
              info
            });
          }
        }
      },
      AccountData: {
        account: {
          selectionSet: `{ id }`,
          resolve(accountData, _args, context, info) {
            return batchDelegateToSchema({
              schema: subgraphSchema,
              operation: 'query',
              fieldName: 'accounts',
              key: accountData.id,
              argsFromKeys: (ids) => ({ where: { id_in: ids } }),
              transforms: transformIdIntoQuery('accounts'),
              valuesFromResults: parseValuesFromResults(),
              context,
              info,
            });
          }
        }
      }
    }
  });
}

console.log(`Waiting on subgraph resource: ${<string>process.env.SUBGRAPH_RESOURCE} 
  and textile resource: ${<string>process.env.TEXTILE_RESOURCE}`);

waitOn({ 
  resources: [
    `${<string>process.env.SUBGRAPH_RESOURCE}`, 
    `${<string>process.env.TEXTILE_RESOURCE}`
  ] 
}, async () => {
  console.log('Sucessfully connected to subgraph and textile resources.');
  startServer(await makeGatewaySchema(), 'gateway', parseInt(<string>process.env.STITCHED_PORT));
});

// Below are the singular non-batched methods... not sure if we still need these eventually
/*
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
*/
