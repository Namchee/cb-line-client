import { UserService } from './user';

import { Service, ServiceResult } from '../service';

import { UserRepository } from '../../repository/db/user';
import { REPLY } from './reply';

export class GantiService extends UserService implements Service {
  public constructor(repository: UserRepository) {
    super(repository);
  }

  public async handle(
    id: string,
    state: number,
    text: string,
  ): Promise<ServiceResult> {
    if (await !this.checkUserExistence(id)) {
      throw new Error(REPLY.NO_ASSOCIATE);
    }

    switch (state) {
      case 1: {
        return this.handleFirstState(id, text);
      }
      case 2: {
        return this.handleSecondState(id, text);
      }
      default: {
        return this.handleFromStart(id, text);
      }
    }
  }

  private async handleFromStart(
    id: string,
    text: string,
  ): Promise<ServiceResult> {
    const fragments = text.split(' ');

    if (fragments[0] !== 'ganti') {
      throw new Error(REPLY.ERROR);
    }

    if (fragments.length === 1) {
      return {
        state: 1,
        message: REPLY.INPUT_ASSOCIATE,
      };
    }

    if (fragments.length === 2) {
      if (!this.isValidNPM(fragments[1])) {
        throw new Error(REPLY.INVALID_NPM);
      }

      const user = await this.userRepository.find(id);

      if (user && user.npm !== fragments[1]) {
        throw new Error(REPLY.MISMATCHED_NPM);
      }

      return {
        state: 2,
        message: REPLY.INPUT_NEW_ASSOCIATE,
      };
    } else if (fragments.length === 3) {
      if (!this.isValidNPM(fragments[1])) {
        throw new Error(REPLY.INVALID_NPM);
      }

      const user = await this.userRepository.find(id);

      if (user && user.npm !== fragments[1]) {
        throw new Error(REPLY.MISMATCHED_NPM);
      }

      if (!this.isValidNPM(fragments[2])) {
        throw new Error(REPLY.INVALID_NPM);
      }

      await this.userRepository.update(id, fragments[2]);

      return {
        state: 0,
        message: REPLY.CHANGE_SUCCESS,
      };
    } else {
      throw new Error(REPLY.WRONG_FORMAT);
    }
  }

  private async handleFirstState(
    id: string,
    text: string
  ): Promise<ServiceResult> {
    if (text.split(' ').length > 1) {
      throw new Error(REPLY.WRONG_FORMAT);
    }

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
    if (text.split(' ').length > 1) {
      throw new Error(REPLY.WRONG_FORMAT);
    }

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
