import { LineService } from './line-service';
import { UserRepository } from '../../repository/user';
import { LineMessage } from './messages/factory';

export class LineDaftarService extends LineService implements DaftarService {
  public readonly repository: UserRepository;

  public constructor(state: number, text: string, repository: UserRepository) {
    super(state, text);
    this.repository = repository;
  }

  public formatMessage(): LineMessage {
    
  }
}
