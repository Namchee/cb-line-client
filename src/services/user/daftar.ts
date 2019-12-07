import { Service, ServiceParameters, HandlerParameters } from '../base';
import { ServiceResult } from '../base';
import { REPLY, USER_REPLY } from './../reply';
import { UserError, ServerError } from '../../types/error';
import { UserAccountRepository } from '../../repository/user-account';

export class DaftarService extends Service {
  private readonly userAccountRepository: UserAccountRepository;

  public constructor(
    userAccountRepository: UserAccountRepository
  ) {
    super();

    this.handler = [this.handleZeroState, this.handleFirstState];
    this.userRelated = true;
    this.userAccountRepository = userAccountRepository;
    this.identifier = 'daftar';
  }

  public handle = async (
    {
      state,
      text,
      account,
      provider,
    }: ServiceParameters
  ): Promise<ServiceResult> => {
    if (!account || !provider) {
      throw new ServerError(REPLY.ERROR, 500);
    }

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

    const handlerLength = this.handler.length;
    const fragmentsLength = fragments.length;

    for (let i = state; i < handlerLength && i < fragmentsLength; i++) {
      try {
        result = await this.handler[i](
          { text: fragments[i], account, provider }
        );
      } catch (e) {
        if (result.state === -1) {
          throw e;
        }

        break;
      }
    }

    if (result.state === -1) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return result;
  }

  private handleZeroState = async (
    {
      text,
    }: HandlerParameters
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
    {
      text,
      account,
      provider,
    }: HandlerParameters
  ): Promise<ServiceResult> => {
    if (!provider || !account) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    const user = await this.userAccountRepository.findUserByNomor(text);

    if (!user) {
      throw new UserError(USER_REPLY.NOT_REGISTERED);
    }

    const clientAccount = await this.userAccountRepository
      .findUserAccountByProvider(
        provider,
        text,
      );

    if (clientAccount) {
      throw new UserError(USER_REPLY.ALREADY_REGISTERED);
    }

    await this.userAccountRepository.addUserAccount(provider, account, text);

    return {
      state: 0,
      message: USER_REPLY.CREATE_SUCCESS,
    };
  }
}
