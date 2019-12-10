import {
  ServiceResult,
  Service,
  ServiceParameters,
  HandlerParameters,
} from '../base';
import { REPLY, USER_REPLY } from '../reply';
import { UserAccountRepository } from '../../repository/user-account';
import { UserError, ServerError, isUserError } from '../../types/error';
import { Message, MessageBody } from '../message/type';

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
    this.identifier = 'ganti';
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
        } else {
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

    if (!user) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    if (text !== user.nomor) {
      throw new UserError(USER_REPLY.MISMATCHED_NOMOR);
    }

    return {
      state: 2,
      message: [
        Message.createTextMessage([
          MessageBody.createTextBody(USER_REPLY.INPUT_NEW_ASSOCIATE),
        ]),
      ],
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

    const clientAccount = await this.userAccountRepository
      .findUserAccountByProvider(
        provider,
        text,
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

    await this.userAccountRepository
      .updateUserAccount(
        account,
        provider,
        oldUser,
        newUser,
      );

    return {
      state: 0,
      message: [
        Message.createTextMessage([
          MessageBody.createTextBody(USER_REPLY.CHANGE_SUCCESS),
        ]),
      ],
    };
  }
}
