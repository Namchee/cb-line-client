import { LineResponse } from './line-service';
import { UserRepository } from '../../repository/user';
import { LineMessage } from './messages/factory';
import { DaftarService } from '../base/daftar';
import { Service } from '../service';

export class LineDaftarService extends DaftarService implements Service<LineResponse, LineMessage> {
  public constructor(state: number, text: string, repository: UserRepository) {
    super(state, text, repository);
  }

  protected formatMessage(
    type: string,
    contents: string | string[]
  ): LineMessage {

  }

  public async handle(id: string): LineResponse {
    const fragments: string[] = this.text.split(' ');

    switch (this.state) {
      case 1: {
        break;
      }
      default: {
        // TODO: VALIDATE NPM
        await this.userRepository.create(`line@${id}`, fragments[1]);
      }
    }
  }
}
