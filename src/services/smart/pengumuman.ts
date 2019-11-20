import {
  SmartService,
  ServiceResult,
  HandlerParameters,
  ServiceParameters,
} from '../service';
import { UserAccountRepository } from '../../repository/user-account';
import { ServerError } from '../../types/error';
import { REPLY } from '../reply';

export class PengumumanService extends SmartService {
  private readonly userAccountRepository: UserAccountRepository;

  public constructor(
    userAccountRepository: UserAccountRepository
  ) {
    super();

    this.userAccountRepository = userAccountRepository;
    this.identifier = ['cari', 'carikan', 'pengumuman'];
    this.userRelated = true;
    this.handler = [this.handleFirstState];
  }

  public handle = async (
    {
      state,
      text,
      account,
      provider,
    }: ServiceParameters
  ): Promise<ServiceResult> => {
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

    return {
      state: 1,
      message: 'Hello from pengumuman service!',
    };
  }
}
