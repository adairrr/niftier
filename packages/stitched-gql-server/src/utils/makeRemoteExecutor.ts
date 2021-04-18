import { fetch } from 'cross-fetch';
import { print } from 'graphql';
import type { ASTNode } from 'graphql'

interface RemoteExecutorOptions {
  log?: boolean
}

export default function makeRemoteExecutor(url: string, options: RemoteExecutorOptions = {}) {
  return async function domainRemoteExecutor({
    document,
    variables,
  }: {
    document: ASTNode
    variables?: Record<string, any>
  }) {
    const query = typeof document === 'string' ? document : print(document)
    if (options.log) console.log(`# -- OPERATION ${new Date().toISOString()}:\n${query}`);

    const fetchResult = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })

    return fetchResult.json()
  }
}
