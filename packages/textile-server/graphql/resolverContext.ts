import { UserRepository } from "../textile/repositories/UserRepository";
import Textile from '../textile/textile';

export class ResolverContext {
  readonly User: UserRepository;

  constructor(t: Textile) {
    this.User = t.getRepository(UserRepository, 'User');
  }
}
