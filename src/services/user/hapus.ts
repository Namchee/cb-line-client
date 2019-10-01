import { UserService } from './user';
import { ServiceResult } from './../service';
import { AccountRepository } from '../../repository/account';
import { REPLY } from './../reply';
import { USER_REPLY } from './reply';
import { UserAccountRepository } from '../../repository/user-account';
import { UserRepository } from '../../repository/user';

export class HapusService extends UserService {
  private readonly userAccountRepository: UserAccountRepository;

  public constructor(
    accountRepository: AccountRepository,
    userRepository: UserRepository,
    userAccountRepository: UserAccountRepository
  ) {
    super(accountRepository, userRepository);
    this.userAccountRepository = userAccountRepository;

    HapusService.handler = [this.handleZeroState, this.handleFirstState];
  }

  public handle = async (
    id: string,
    state: number,
    text: string,
  ): Promise<ServiceResult> => {
    const fragments = text.split(' ');

    if (fragments.length > (2 - state)) {
      throw new Error(REPLY.WRONG_FORMAT);
    }

    let result: ServiceResult = {
      state: -1,
      message: '',
    };

    for (let i = (state) ? state : 0; i < 2; i++) {
      result = await HapusService.handler[i](id, fragments[i]);
    }

    if (result.state === -1) {
      throw new Error(REPLY.ERROR);
    }

    return result;
  }

  private handleZeroState = async (
    id: string,
    text: string
  ): Promise<ServiceResult> => {
    if (text !== 'hapus') {
      throw new Error(REPLY.ERROR);
    }

    return {
      state: 1,
      message: USER_REPLY.INPUT_ASSOCIATE,
    };
  }

  private async handleFirstState(
    id: string,
    text: string
  ): Promise<ServiceResult> {
    const nomor = await this.userAccountRepository.findUserNomor(text);

    if (nomor === null) {
      throw new Error(USER_REPLY.NO_ASSOCIATE);
    }

    await this.accountRepository.deleteAccount(id);

    return {
      state: 0,
      message: USER_REPLY.DELETE_SUCCESS,
    };
  }
}
