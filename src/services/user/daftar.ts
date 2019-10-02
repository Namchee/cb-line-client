import { UserService } from './user';
import { ServiceResult } from './../service';
import { AccountRepository } from '../../repository/account';
import { USER_REPLY } from './reply';
import { REPLY } from './../reply';
import { UserRepository } from '../../repository/user';

export class DaftarService extends UserService {
  public constructor(
    accountRepository: AccountRepository,
    userRepository: UserRepository
  ) {
    super(accountRepository, userRepository);

    DaftarService.handler = [this.handleZeroState, this.handleFirstState];
  }

  public handle = async (
    id: string,
    state: number,
    text: string,
  ): Promise<ServiceResult> => {
    const exist = await this.checkAccountExistence(id);

    if (exist) {
      throw new Error(USER_REPLY.ALREADY_REGISTERED);
    }

    const fragments = text.split(' ');

    if (fragments.length > 2) {
      throw new Error(REPLY.WRONG_FORMAT);
    }

    let result: ServiceResult = {
      state: -1,
      message: '',
    };

    const handlerLength = DaftarService.handler.length;
    const fragmentsLength = fragments.length;

    for (let i = state; i < handlerLength && i < fragmentsLength; i++) {
      result = await DaftarService.handler[i](id, fragments[i]);
    }

    if (result.state === -1) {
      throw new Error(REPLY.ERROR);
    }

    return result;
  }

  private handleZeroState = async (
    id: string,
    text: string,
  ): Promise<ServiceResult> => {
    if (text !== 'daftar') {
      throw new Error(REPLY.ERROR);
    }

    return {
      state: 1,
      message: USER_REPLY.INPUT_NOMOR,
    };
  }

  private handleFirstState = async (
    id: string,
    text: string,
  ): Promise<ServiceResult> => {
    const provider = id.split('@')[0];

    const user = await this.userRepository.findOne(text);

    if (!user) {
      throw new Error(USER_REPLY.NOT_REGISTERED);
    }

    const clientAccount = await this.accountRepository.findClientAccount(
      provider,
      user
    );

    if (clientAccount) {
      throw new Error(USER_REPLY.ALREADY_REGISTERED);
    }

    await this.accountRepository.addAccount(id, user);

    return {
      state: 0,
      message: USER_REPLY.CREATE_SUCCESS,
    };
  }
}
