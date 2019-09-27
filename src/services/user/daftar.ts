import { UserService } from './user';
import { ServiceResult } from './../service';
import { UserRepository } from '../../repository/db/user';
import { REPLY } from './reply';

export class DaftarService extends UserService {
  public constructor(repository: UserRepository) {
    super(repository);

    DaftarService.handler = [this.handleZeroState, this.handleFirstState];
  }

  public async handle(
    id: string,
    state: number,
    text: string,
  ): Promise<ServiceResult> {
    if (await this.checkUserExistence(id)) {
      throw new Error(REPLY.ALREADY_REGISTERED);
    }

    const fragments = text.split(' ');

    if (fragments.length > 2) {
      throw new Error(REPLY.WRONG_FORMAT);
    }

    let result: ServiceResult | Promise<ServiceResult> = {
      state: -1,
      message: '',
    };

    for (let i = (state) ? state : 0; i < 2; i++) {
      result = DaftarService.handler[i](id, fragments[i]);
    }

    return result;
  }

  private async handleZeroState(
    id: string,
    text: string
  ): Promise<ServiceResult> {
    if (text !== 'daftar') {
      throw new Error(REPLY.ERROR);
    }

    return {
      state: 1,
      message: REPLY.INPUT_NPM,
    };
  }

  private async handleFirstState(
    id: string,
    text: string
  ): Promise<ServiceResult> {
    if (!this.isValidNPM(text)) {
      throw new Error(REPLY.INVALID_NPM);
    }

    await this.userRepository.create(id, text);

    return {
      state: 0,
      message: REPLY.CREATE_SUCCESS,
    };
  }
}
