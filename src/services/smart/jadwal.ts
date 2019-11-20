import {
  SmartService,
  ServiceParameters,
  ServiceResult,
  HandlerParameters,
} from '../service';
import { ServerError } from '../../types/error';
import { REPLY } from '../reply';

export class JadwalService extends SmartService {
  public constructor() {
    super();

    this.identifier = ['cari', 'carikan', 'jadwal', 'kosong'];
    this.userRelated = false;
    this.handler = [this.handleFirstState];
  }

  public handle = async (
    {
      state,
      text,
    }: ServiceParameters
  ): Promise<ServiceResult> => {
    let result: ServiceResult = {
      state: -1,
      message: '',
    };

    for (let i = state; i < this.handler.length; i++) {
      result = await this.handler[i]({ text });
    }

    if (result.state === -1) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return result;
  }

  private handleFirstState = async (
    {
      text,
    }: HandlerParameters
  ): Promise<ServiceResult> => {
    return {
      state: 1,
      message: 'Hello from jadwal service!',
    };
  }
}
