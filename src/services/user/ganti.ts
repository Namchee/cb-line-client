import {
  ServiceResult,
  Service,
  ServiceParameters,
  HandlerParameters,
} from '../service';
import { USER_REPLY } from './reply';
import { REPLY } from '../reply';
import { UserAccountRepository } from '../../repository/user-account';
import { UserError, ServerError } from '../../types/error';

export class GantiService extends Service {
  private readonly userAccountRepository: UserAccountRepository;

  public constructor(userAccountRepository: UserAccountRepository) {
    super();

    this.handler = [
      this.handleZeroState,
      this.handleFirstState,
      this.handleSecondState,
    ];

    this.userRelated = true;
    this.userAccountRepository = userAccountRepository;
  }

  public handle = async (
    {
      state,
      text,
      account,
      provider,
    }: ServiceParameters
  ): Promise<ServiceResult> => {
    if (!provider || !account) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    const exist = await this.userAccountRepository.exist(provider, account);

    if (!exist) {
      throw new UserError(USER_REPLY.NO_ASSOCIATE);
    }

    const fragments = text.split(' ');

    if (fragments.length > 3) {
      throw new UserError(REPLY.WRONG_FORMAT);
    }

    let result: ServiceResult = {
      state: -1,
      message: '',
    };

    const handlerLength = this.handler.length;
    const fragmentsLength = fragments.length;

    for (let i = state; i < handlerLength && i < fragmentsLength; i++) {
      result = await this.handler[i]({ text: fragments[i], account, provider });
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
    if (text !== 'ganti') {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return {
      state: 1,
      message: USER_REPLY.INPUT_ASSOCIATE,
    };
  }

  private handleFirstState = async (
    {
      text,
      account,
      provider,
    }: HandlerParameters
  ): Promise<ServiceResult> => {
    if (!account || !provider) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    const user = await this.userAccountRepository.findUserByAccount(
      provider,
      account
    );

    if (!user) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    if (text !== user.nomor) {
      throw new UserError(USER_REPLY.MISMATCHED_NOMOR);
    }

    return {
      state: 2,
      message: USER_REPLY.INPUT_NEW_ASSOCIATE,
    };
  }

  private handleSecondState = async (
    {
      text,
      account,
      provider,
    }: HandlerParameters
  ): Promise<ServiceResult> => {
    if (!account || !provider) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    const newUser = await this.userAccountRepository.findUserByNomor(text);

    if (newUser === null) {
      throw new UserError(USER_REPLY.NOT_REGISTERED);
    }

    const clientAccount = await this.userAccountRepository.findClientAccount(
      provider,
      newUser
    );

    if (clientAccount) {
      throw new UserError(USER_REPLY.ALREADY_REGISTERED);
    }

    const oldUser = await this.userAccountRepository.findUserByAccount(
      provider,
      account,
    );

    // BL error
    if (oldUser === null) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    if (oldUser.nomor === text) {
      throw new UserError(USER_REPLY.SAME_NOMOR);
    }

    await this.userAccountRepository.move(provider, account, oldUser, newUser);

    return {
      state: 0,
      message: USER_REPLY.CHANGE_SUCCESS,
    };
  }
}
