import { LineService, LineResponse } from './line-service';
import { UserRepository } from '../../repository/user';
import { LineMessage } from './messages/factory';

export class LineDaftarService extends LineService {
  private readonly userRepository: UserRepository;

  public constructor(repository: UserRepository) {
    super();
    this.userRepository = repository;
  }

  protected determineState(text: string): number {
    return 0;
  }

  protected formatMessage(
    type: string,
    contents: string | string[]
  ): LineMessage {

  }

  public handle(state: number, text: string): LineResponse {
    if (state === -1) {
      state = this.determineState(text);
    }

    const fragments: string[] = text.split(' ');

    switch (state) {
      case 0: {

      }
      case 1: {

      }
    }
  }
}
