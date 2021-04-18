"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = require("@graphql-tools/load");
const url_loader_1 = require("@graphql-tools/url-loader");
const wrap_1 = require("@graphql-tools/wrap");
const graphql_1 = require("graphql");
const cross_fetch_1 = require("cross-fetch");
exports.default = (url, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const typeDefs = yield load_1.loadSchema(url, { loaders: [new url_loader_1.UrlLoader()] });
    return wrap_1.wrapSchema({
        schema: typeDefs,
        executor: ({ document, variables, context }) => __awaiter(void 0, void 0, void 0, function* () {
            const query = typeof document === 'string' ? document : graphql_1.print(document);
            if (options.log)
                console.log(`# -- OPERATION ${new Date().toISOString()}:\n${query}`);
            return cross_fetch_1.fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables })
            }).then(res => res.json());
        })
    });
});
