"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wait_on_1 = __importDefault(require("wait-on"));
const stitch_1 = require("@graphql-tools/stitch");
const delegate_1 = require("@graphql-tools/delegate");
const utils_1 = require("./utils");
const dotenv = __importStar(require("dotenv"));
const getRemoteSchema_1 = __importDefault(require("./utils/getRemoteSchema"));
dotenv.config();
function makeGatewaySchema() {
    return __awaiter(this, void 0, void 0, function* () {
        // build executor functions for communicating with remote services
        // const subgraphExec = makeRemoteExecutor(<string>process.env.SUBGRAPH_URL, { log: true });
        // const textileExec = makeRemoteExecutor(<string>process.env.TEXTILE_URL, { log: true });
        // const subgraphSchema = await introspectSchema(subgraphExec);
        // const textileSchema = await introspectSchema(textileExec);
        const subgraphSchema = yield getRemoteSchema_1.default(process.env.SUBGRAPH_URL, { log: true });
        const textileSchema = yield getRemoteSchema_1.default(process.env.TEXTILE_URL, { log: true });
        return stitch_1.stitchSchemas({
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
                            return delegate_1.delegateToSchema({
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
                            return delegate_1.delegateToSchema({
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
    });
}
wait_on_1.default({
    resources: [
        `tcp:${process.env.SUBGRAPH_PORT}`,
        `tcp:${process.env.TEXTILE_PORT}`
    ]
}, () => __awaiter(void 0, void 0, void 0, function* () {
    utils_1.startServer(yield makeGatewaySchema(), 'gateway', parseInt(process.env.STITCHED_PORT));
}));
