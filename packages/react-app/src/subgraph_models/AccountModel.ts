import { Instance, types, flow } from 'mobx-state-tree';
import { BasicProfile } from '@ceramicstudio/idx-constants';
import { AccountModelBase } from './AccountModel.base';
import { CeramicAuthStore } from '../store';
import { ethAddressToDID } from '../apis/ceramic';

/* The TypeScript type of an instance of AccountModel */
export interface AccountModelType extends Instance<typeof AccountModel.Type> {}

/* A graphql query fragment builders for AccountModel */
export { selectFromAccount, accountModelPrimitives, AccountModelSelector } from './AccountModel.base';

const imageMetadataModel = types.model({
  src: types.optional(types.string, ''), // not really optional
  mimeType: types.optional(types.string, ''), // not really optional
  width: types.optional(types.number, 0), // not really optional
  height: types.optional(types.number, 0), // not really optional
  size: types.optional(types.number, 0),
});

const imageSourcesModel = types.model({
  original: types.optional(imageMetadataModel, {}),
  alternatives: types.array(imageMetadataModel),
});

const basicProfileModel = types.model({
  name: types.optional(types.string, ''),
  image: types.optional(imageSourcesModel, {}),
  description: types.optional(types.string, ''),
  emoji: types.optional(types.string, ''),
  background: types.optional(imageSourcesModel, {}),
  birthDate: types.optional(types.string, ''),
  url: types.optional(types.string, ''),
  gender: types.optional(types.string, ''),
  homeLocation: types.optional(types.string, ''),
  residenceCountry: types.optional(types.string, ''),
  nationalities: types.array(types.string),
  affiliations: types.array(types.string),
});

/**
 * AccountModel
 */
export const AccountModel = AccountModelBase.props({
  basicProfile: types.optional(basicProfileModel, {}),
  loadingProfile: types.optional(types.boolean, true),
  accountDid: types.maybe(types.string),
})
  .actions(self => ({
    fetchAccountDid: flow(function* fetchAccountDid(authStore: CeramicAuthStore) {
      try {
        self.accountDid = yield ethAddressToDID(authStore.ceramic, self.id);
      } catch (error) {
        console.log('fetchAccountDid error: ', { error });
      }
    }),

    fetchBasicProfile: flow(function* fetchBasicProfile(authStore: CeramicAuthStore) {
      console.log('not implemented');
    }),
  }))

  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self));
    },
  }));
