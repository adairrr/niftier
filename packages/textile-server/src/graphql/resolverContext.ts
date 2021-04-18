import { AccountDataRepository } from "../textile/repositories/AccountDataRepository";
import Textile from '../textile/textile';

export class ResolverContext {
  readonly AccountData: AccountDataRepository;

  constructor(t: Textile) {
    this.AccountData = t.getRepository(AccountDataRepository, 'AccountData');
  }
}
