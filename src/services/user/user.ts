import { AccountRepository } from '../../repository/account';
import { Service } from '../service';
import { UserRepository } from '../../repository/user';

export abstract class UserService extends Service {
  protected readonly userRepository: UserRepository;

  public constructor(
    accountRepository: AccountRepository,
    userRepository: UserRepository
  ) {
    super(accountRepository);
    this.userRepository = userRepository;
  }

  protected checkUserExistence = async (nomor: string): Promise<boolean> => {
    return this.userRepository.exist(nomor);
  }
}
