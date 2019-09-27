import { UserService } from './user';
import { ServiceResult } from '../service';
import { UserRepository } from '../../repository/db/user';
import { REPLY } from './reply';

export class GantiService extends UserService {
  public constructor(repository: UserRepository) {
    super(repository);

    GantiService.handler = [
      this.handleZeroState,
      this.handleFirstState,
      this.handleSecondState,
    ];
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

    if (fragments.length > 3) {
      throw new Error(REPLY.WRONG_FORMAT);
    }

    let result: ServiceResult | Promise<ServiceResult> = {
      state: -1,
      message: '',
    };

    for (let i = (state) ? state : 0; i < 3; i++) {
      result = GantiService.handler[i](id, fragments[i]);
    }

    return result;
  }

  private async handleZeroState(
    id: string,
    text: string,
  ): Promise<ServiceResult> {
    if (text !== 'ganti') {
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

    return {
      state: 2,
      message: REPLY.INPUT_NEW_ASSOCIATE,
    };
  }

  private async handleSecondState(
    id: string,
    text: string,
  ): Promise<ServiceResult> {
    if (!this.isValidNPM(text)) {
      throw new Error(REPLY.INVALID_NPM);
    }

    await this.userRepository.update(id, text);

    return {
      state: 0,
      message: REPLY.CHANGE_SUCCESS,
    };
  }
}
