import { UserRepository } from '../../repository/user';

export interface DaftarService {
  readonly userRepository: UserRepository;  
}
