import {
  ServiceResult,
  HandlerParameters,
  ServiceParameters,
  SmartService,
} from '../base';
import { UserAccountRepository } from '../../repository/user-account';
import { ServerError, UserError } from '../../types/error';
import { REPLY, USER_REPLY, SMART_REPLY } from '../reply';
import { MataKuliahRepository } from '../../repository/mata-kuliah';

export class PengumumanService extends SmartService {
  private readonly userAccountRepository: UserAccountRepository;
  private readonly mataKuliahRepository: MataKuliahRepository;

  public constructor(
    userAccountRepository: UserAccountRepository,
    mataKuliahRepository: MataKuliahRepository,
  ) {
    super();

    this.identifier = 'pengumuman';
    this.userRelated = true;
    this.handler = [this.handleFirstState];
    this.keywords = [
      'tolong',
      'cari',
      'carikan',
      'pengumuman',
      'untuk',
      'mata',
      'kuliah',
    ];
    this.userAccountRepository = userAccountRepository;
    this.mataKuliahRepository = mataKuliahRepository;
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

    const user = await this.userAccountRepository.exist(provider, account);

    if (!user) {
      throw new UserError(USER_REPLY.NO_ASSOCIATE);
    }

    let result: ServiceResult = {
      state: -1,
      message: '',
    };

    for (let i = state; i < this.handler.length; i++) {
      result = await this.handler[i]({ text, account, provider });
    }

    if (result.state === -1) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return result;
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
      throw new UserError(USER_REPLY.NO_ASSOCIATE);
    }

    return {
      state: 0,
      message: SMART_REPLY.CHOOSE_MATA_KULIAH,
    };
  }
}
