import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import * as dotenv from 'dotenv';

export default function startServer(schema: any, name: string, port: number) {
  const app = express();
  app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));
  app.listen(port, () => (
    console.log(`${name} running at http://localhost:${port}/graphql`)
  ));
}
