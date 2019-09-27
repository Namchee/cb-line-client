import { UserRepository } from '../../repository/db/user';
import { Service } from '../service';

export abstract class UserService extends Service {
  protected readonly userRepository: UserRepository;

  public constructor(repository: UserRepository) {
    super();
    this.userRepository = repository;
  }

  protected checkUserExistence(id: string): Promise<boolean> {
    return this.userRepository.exist(id);
  }

  protected isValidNPM(npm: string): boolean {
    return true;
  }
}
