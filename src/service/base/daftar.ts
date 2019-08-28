import { UserRepository } from '../../repository/user';
import { StatefulService } from '../service';

export abstract class DaftarService extends StatefulService {
  protected readonly userRepository: UserRepository;

  public constructor(state: number, text: string, repository: UserRepository) {
    super(state, text);
    this.userRepository = repository;
  } 
}
