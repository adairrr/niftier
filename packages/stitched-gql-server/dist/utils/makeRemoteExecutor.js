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
const cross_fetch_1 = require("cross-fetch");
const graphql_1 = require("graphql");
function makeRemoteExecutor(url, options = {}) {
    return function domainRemoteExecutor({ document, variables, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = typeof document === 'string' ? document : graphql_1.print(document);
            if (options.log)
                console.log(`# -- OPERATION ${new Date().toISOString()}:\n${query}`);
            const fetchResult = yield cross_fetch_1.fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables }),
            });
            return fetchResult.json();
        });
    };
}
exports.default = makeRemoteExecutor;
