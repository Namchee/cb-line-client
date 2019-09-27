import { UserService } from './user';
import { ServiceResult } from './../service';
import { UserRepository } from './../../repository/db/user';
import { REPLY } from './reply';

export class HapusService extends UserService {
  public constructor(repository: UserRepository) {
    super(repository);

    HapusService.handler = [this.handleZeroState, this.handleFirstState];
  }

  public async handle(
    id: string,
    state: number,
    text: string,
  ): Promise<ServiceResult> {
    if (await !this.checkUserExistence(id)) {
      throw new Error(REPLY.NO_ASSOCIATE);
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
      result = HapusService.handler[i](id, fragments[i]);
    }

    return result;
  }

  private async handleZeroState(
    id: string,
    text: string
  ): Promise<ServiceResult> {
    if (text !== 'hapus') {
      throw new Error(REPLY.ERROR);
    }

    return {
      state: 1,
      message: REPLY.INPUT_ASSOCIATE,
    };
  }

  private async handleFirstState(
    id: string,
    text: string
  ): Promise<ServiceResult> {
    if (!this.isValidNPM(text)) {
      throw new Error(REPLY.INVALID_NPM);
    }

    const user = await this.userRepository.find(id);

    if (user && user.npm !== text) {
      throw new Error(REPLY.MISMATCHED_NPM);
    }

    await this.userRepository.delete(id);

    return {
      state: 0,
      message: REPLY.DELETE_SUCCESS,
    };
  }
}
