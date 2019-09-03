import { UserService } from './user';

import { Service, ServiceResult } from '../service';

import { UserRepository } from '../../repository/db/user';
import { REPLY } from './reply';

export class DaftarService extends UserService implements Service {
  public constructor(repository: UserRepository) {
    super(repository);
  }

  public async handle(
    id: string,
    state: number,
    text: string,
  ): Promise<ServiceResult> {
    if (await this.checkUserExistence(id)) {
      throw new Error(REPLY.ALREADY_REGISTERED);
    }

    switch (state) {
      case 1: {
        return this.handleFirstState(id, text);
      }
      default: {
        return this.handleFromStart(id, text);
      }
    }
  }

  private async handleFromStart(
    id: string,
    text: string
  ): Promise<ServiceResult> {
    const fragments = text.split(' ');

    if (fragments[0] !== 'daftar') {
      throw new Error(REPLY.ERROR);
    }

    if (fragments.length === 1) {
      return {
        state: 1,
        message: REPLY.INPUT_NPM,
      };
    }

    if (fragments.length === 2) {
      if (!this.isValidNPM(fragments[1])) {
        throw new Error(REPLY.INVALID_NPM);
      }

      await this.userRepository.create(`line@${id}`, text);

      return {
        state: 0,
        message: REPLY.CREATE_SUCCESS,
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

    await this.userRepository.create(id, text);

    return {
      state: 0,
      message: REPLY.CREATE_SUCCESS,
    };
  }
}
