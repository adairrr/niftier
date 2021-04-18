"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
function startServer(schema, name, port) {
    const app = express_1.default();
    app.use('/graphql', express_graphql_1.graphqlHTTP({ schema, graphiql: true }));
    app.listen(port, () => (console.log(`${name} running at http://localhost:${port}/graphql`)));
}
exports.default = startServer;
