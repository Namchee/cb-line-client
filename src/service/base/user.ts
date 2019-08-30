import { UserRepository } from '../../repository/user';

export abstract class UserService {
  protected readonly userRepository: UserRepository;

  public constructor(repository: UserRepository) {
    this.userRepository = repository;
  }

  protected checkUserExistence(id: string): Promise<boolean> {
    return this.userRepository.exist(id);
  }

  protected isValidNPM(npm: string): boolean {
    return true;
  }
}
