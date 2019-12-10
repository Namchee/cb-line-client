import {
  ServiceResult,
  Service,
  ServiceParameters,
  HandlerParameters,
} from '../base';
import { REPLY, USER_REPLY } from './../reply';
import { UserAccountRepository } from '../../repository/user-account';
import { UserError, ServerError, isUserError } from '../../types/error';
import { Message, MessageBody } from '../message/type';

export class HapusService extends Service {
  private readonly userAccountRepository: UserAccountRepository;

  public constructor(
    userAccountRepository: UserAccountRepository
  ) {
    super();

    this.handler = [this.handleZeroState, this.handleFirstState];
    this.userRelated = true;
    this.userAccountRepository = userAccountRepository;
    this.identifier = 'hapus';
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

    if (!exist) {
      throw new UserError(USER_REPLY.NO_ASSOCIATE);
    }

    const fragments = text.split(' ');

    if (fragments.length > 2) {
      throw new UserError(REPLY.WRONG_FORMAT);
    }

    let result: ServiceResult = {
      state: -1,
      message: [],
    };

    const handlerLength = this.handler.length;
    const fragmentsLength = fragments.length;

    for (let i = state; i < handlerLength && i < fragmentsLength; i++) {
      try {
        result = await this.handler[i](
          { text: fragments[i], account, provider }
        );
      } catch (e) {
        if (result.state === -1 || i === 0 || !isUserError(e)) {
          throw e;
        }

        const err = e as UserError;

        result = {
          state: result.state,
          message: [
            Message.createTextMessage([
              MessageBody.createTextBody(err.message),
            ]),
            ...result.message,
          ],
        };

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
    if (text !== 'hapus') {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return {
      state: 1,
      message: [
        Message.createTextMessage([
          MessageBody.createTextBody(USER_REPLY.INPUT_ASSOCIATE),
        ]),
      ],
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

    if (user === null) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    if (user.nomor !== text) {
      throw new UserError(USER_REPLY.MISMATCHED_NOMOR);
    }

    const deleteResult = await this.userAccountRepository.deleteUserAccount(
      provider,
      account
    );

    if (!deleteResult) {
      throw new ServerError('Delete failed', 500);
    }

    return {
      state: 0,
      message: [
        Message.createTextMessage([
          MessageBody.createTextBody(USER_REPLY.DELETE_SUCCESS),
        ]),
      ],
    };
  }
}
