import { makeExecutableSchema } from "apollo-server";
import "graphql-import-node";
import * as file from "./schema.graphql";

export const graphQlSchema = makeExecutableSchema({ typeDefs: file });
export const schema = file;
