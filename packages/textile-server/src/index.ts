import { ResolverContext } from './graphql/resolverContext';
import resolvers from './graphql/resolvers';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './graphql/schemaLoader';
import express from 'express';

import * as dotenv from "dotenv";
import Textile from './textile/textile';
import { createPrometheusExporterPlugin } from '@bmatei/apollo-prometheus-exporter';

dotenv.config()

Textile.Instance().then(async (t) => {

  const app = express();

  console.log("Creating the Prometheus exporter plugin")
  const prometheusExporterPlugin = createPrometheusExporterPlugin({ app });

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    introspection: true,
    playground: true,
    plugins: [prometheusExporterPlugin],
    context: new ResolverContext(t),
    tracing: true
  });

  console.log("Applying middleware")

  server.applyMiddleware({ app, path: '/' });

  console.log("Attempting to start the apollo server")
  try {
    app.listen({ port: process.env.TEXTILE_SERVER_PORT }, () => {
      console.log(`🚀 Server ready at http://localhost:${process.env.TEXTILE_SERVER_PORT}`)
      // console.log(`🚀 Server ready at ${subscriptionsUrl}`)
    })
  } catch (err) {
    console.log(err);
  }

}).catch(error => console.log(error));
