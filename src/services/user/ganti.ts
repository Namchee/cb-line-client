import { UserService } from './user';
import { ServiceResult } from '../service';
import { AccountRepository } from '../../repository/account';
import { USER_REPLY } from './reply';
import { UserRepository } from '../../repository/user';
import { REPLY } from '../reply';
import { UserAccountRepository } from '../../repository/user-account';

export class GantiService extends UserService {
  private readonly userAccountRepository: UserAccountRepository;

  public constructor(
    accountRepository: AccountRepository,
    userRepository: UserRepository,
    userAccountRepository: UserAccountRepository
  ) {
    super(accountRepository, userRepository);
    this.userAccountRepository = userAccountRepository;

    GantiService.handler = [
      this.handleZeroState,
      this.handleFirstState,
      this.handleSecondState,
    ];
  }

  public handle = async (
    id: string,
    state: number,
    text: string,
  ): Promise<ServiceResult> => {
    const fragments = text.split(' ');

    if (fragments.length > (3 - state)) {
      throw new Error(REPLY.WRONG_FORMAT);
    }

    let result: ServiceResult = {
      state: -1,
      message: '',
    };

    for (let i = (state) ? state : 0; i < 3; i++) {
      result = await GantiService.handler[i](id, fragments[i]);
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
    if (text !== 'ganti') {
      throw new Error(REPLY.ERROR);
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
    const account = await this.accountRepository.findOne(id);

    if (account === null) {
      throw new Error(USER_REPLY.NO_ASSOCIATE);
    }

    const userNomor = await this.userAccountRepository.findUserNomor(
      account.account
    );

    if (userNomor === null) {
      throw new Error(USER_REPLY.NOT_REGISTERED);
    }

    if (text !== userNomor) {
      throw new Error(USER_REPLY.MISMATCHED_NOMOR);
    }

    return {
      state: 2,
      message: USER_REPLY.INPUT_NEW_ASSOCIATE,
    };
  }

  private handleSecondState = async (
    id: string,
    text: string,
  ): Promise<ServiceResult> => {
    const provider = text.split('@')[0];
    const user = await this.userRepository.findOne(text);

    if (user === null) {
      throw new Error(USER_REPLY.NOT_REGISTERED);
    }

    const clientAccount = await this.accountRepository.findClientAccount(
      provider,
      user
    );

    if (clientAccount) {
      throw new Error(USER_REPLY.ALREADY_REGISTERED);
    }

    await this.accountRepository.moveAccount(id, user);

    return {
      state: 0,
      message: USER_REPLY.CHANGE_SUCCESS,
    };
  }
}
