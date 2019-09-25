import { UserRepository } from '../../repository/db/user';
import { ParserFactory } from '../parser/factory';

export abstract class UserService {
  protected readonly userRepository: UserRepository;

  public constructor(repository: UserRepository) {
    this.userRepository = repository;
  }

  protected checkUserExistence(id: string): Promise<boolean> {
    return this.userRepository.exist(id);
  }

  protected isValidNPM(npm: string): boolean {
    return ParserFactory.isValidNPM(npm);
  }
}
