import CeramicClient from '@ceramicnetwork/http-client';
import { IDX } from '@ceramicstudio/idx';
import { definitions, schemas, BasicProfile } from '@ceramicstudio/idx-constants';

declare global {
  interface Window {
    idx?: IDX;
  }
}

export function createIDX(ceramic: CeramicClient, aliases?: any) {
  const idxAliases = aliases || {};
  // TODO see https://developers.idx.xyz/build/aliases/
  // https://developers.idx.xyz/guides/definitions/creating/

  // @ts-ignore
  const idx = new IDX({ ceramic, idxAliases });

  // debug
  window.idx = idx;
  return idx;
}

export async function setUserBasicProfile(idx: IDX, userProfile: BasicProfile): Promise<string> {
  const docID = await idx.set('basicProfile', userProfile);
  return docID.toUrl();
}

export async function getUserBasicProfile(idx: IDX, did: string): Promise<BasicProfile> {
  return idx.get<BasicProfile>('basicProfile', did);
}
