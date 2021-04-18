import waitOn from 'wait-on';
import { ApolloServer } from 'apollo-server';
import { introspectSchema } from '@graphql-tools/wrap';
import { stitchSchemas } from '@graphql-tools/stitch';
import { makeRemoteExecutor, startServer } from './utils';
import * as dotenv from 'dotenv';

dotenv.config();

async function makeGatewaySchema() {
  // build executor functions for communicating with remote services

  const subgraphExec = makeRemoteExecutor(<string>process.env.SUBGRAPH_URL);
  const textileExec = makeRemoteExecutor(<string>process.env.TEXTILE_URL);

  return stitchSchemas({
    subschemas: [
      {
        schema: await introspectSchema(subgraphExec),
        executor: subgraphExec,
        batch: true,
      },
      {
        schema: await introspectSchema(textileExec),
        executor: textileExec,
        batch: true,
      },
    ]
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
