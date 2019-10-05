import { UserService } from './user';
import { ServiceResult } from './../service';
import { AccountRepository } from '../../repository/account';
import { REPLY } from './../reply';
import { USER_REPLY } from './reply';
import { UserAccountRepository } from '../../repository/user-account';
import { UserRepository } from '../../repository/user';
import { UserError, ServerError } from '../../types/error';

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
    const exist = await this.checkAccountExistence(id);

    if (!exist) {
      throw new UserError(USER_REPLY.NO_ASSOCIATE);
    }

    const fragments = text.split(' ');

    if (fragments.length > 2) {
      throw new UserError(REPLY.WRONG_FORMAT);
    }

    let result: ServiceResult = {
      state: -1,
      message: '',
    };

    const handlerLength = HapusService.handler.length;
    const fragmentsLength = fragments.length;

    for (let i = state; i < handlerLength && i < fragmentsLength; i++) {
      result = await HapusService.handler[i](id, fragments[i]);
    }

    if (result.state === -1) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return result;
  }

  private handleZeroState = async (
    id: string,
    text: string
  ): Promise<ServiceResult> => {
    if (text !== 'hapus') {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return {
      state: 1,
      message: USER_REPLY.INPUT_ASSOCIATE,
    };
  }

  private handleFirstState = async (
    id: string,
    text: string
  ): Promise<ServiceResult> => {
    const nomor = await this.userAccountRepository.findUserNomor(id);

    if (nomor !== text) {
      throw new UserError(USER_REPLY.MISMATCHED_NOMOR);
    }

    await this.accountRepository.deleteAccount(id);

    return {
      state: 0,
      message: USER_REPLY.DELETE_SUCCESS,
    };
  }
}
