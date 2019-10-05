import { ServiceResult, Service } from './../service';
import { REPLY } from './../reply';
import { USER_REPLY } from './reply';
import { UserAccountRepository } from '../../repository/user-account';
import { UserError, ServerError } from '../../types/error';

export class HapusService extends Service {
  public constructor(userAccountRepository: UserAccountRepository) {
    super(userAccountRepository);

    HapusService.handler = [this.handleZeroState, this.handleFirstState];
  }

  public handle = async (
    provider: string,
    account: string,
    state: number,
    text: string,
  ): Promise<ServiceResult> => {
    const exist = await this.userAccountRepository.exist(provider, account);

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
      result = await HapusService.handler[i](provider, account, fragments[i]);
    }

    if (result.state === -1) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return result;
  }

  private handleZeroState = async (
    provider: string,
    account: string,
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
    provider: string,
    account: string,
    text: string
  ): Promise<ServiceResult> => {
    const user = await this.userAccountRepository.findUserByAccount(
      provider,
      account
    );

    if (user === null) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    if (user.nomor !== text) {
      throw new UserError(USER_REPLY.MISMATCHED_NOMOR);
    }

    await this.userAccountRepository.delete(provider, account);

    return {
      state: 0,
      message: USER_REPLY.DELETE_SUCCESS,
    };
  }
}
