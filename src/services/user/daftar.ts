import { Service } from './../service';
import { ServiceResult } from './../service';
import { USER_REPLY } from './reply';
import { REPLY } from './../reply';
import { UserError, ServerError } from '../../types/error';
import { UserAccountRepository } from '../../repository/user-account';

export class DaftarService extends Service {
  public constructor(
    userAccountRepository: UserAccountRepository
  ) {
    super(userAccountRepository);

    DaftarService.handler = [this.handleZeroState, this.handleFirstState];
  }

  public handle = async (
    provider: string,
    account: string,
    state: number,
    text: string,
  ): Promise<ServiceResult> => {
    const exist = await this.userAccountRepository.exist(provider, account);

    if (exist) {
      throw new UserError(USER_REPLY.ALREADY_REGISTERED);
    }

    const fragments = text.split(' ');

    if (fragments.length > 2) {
      throw new UserError(REPLY.WRONG_FORMAT);
    }

    let result: ServiceResult = {
      state: -1,
      message: '',
    };

    const handlerLength = DaftarService.handler.length;
    const fragmentsLength = fragments.length;

    for (let i = state; i < handlerLength && i < fragmentsLength; i++) {
      result = await DaftarService.handler[i](provider, account, fragments[i]);
    }

    if (result.state === -1) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return result;
  }

  private handleZeroState = async (
    provider: string,
    account: string,
    text: string,
  ): Promise<ServiceResult> => {
    if (text !== 'daftar') {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return {
      state: 1,
      message: USER_REPLY.INPUT_NOMOR,
    };
  }

  private handleFirstState = async (
    provider: string,
    account: string,
    text: string,
  ): Promise<ServiceResult> => {
    const user = await this.userAccountRepository.findUserByNomor(text);

    if (!user) {
      throw new UserError(USER_REPLY.NOT_REGISTERED);
    }

    const clientAccount = await this.userAccountRepository.findClientAccount(
      provider,
      user
    );

    if (clientAccount) {
      throw new UserError(USER_REPLY.ALREADY_REGISTERED);
    }

    await this.userAccountRepository.add(provider, account, user);

    return {
      state: 0,
      message: USER_REPLY.CREATE_SUCCESS,
    };
  }
}
