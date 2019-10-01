import {
  EntityRepository,
  EntityManager,
  Repository as BaseRepository,
} from 'typeorm';
import { UserAccount } from '../database/entity/user-account';
import { Repository } from './base';

@EntityRepository(UserAccount)
export class UserAccountRepository
  extends Repository<UserAccount> {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  protected get repository(): BaseRepository<UserAccount> {
    return this.manager.getRepository(UserAccount);
  }

  public exist = async (id: string): Promise<boolean> => {
    const count = await this.repository.count({ id });

    return count >= 1;
  }

  public findUserNomor = async (id: string): Promise<string | null> => {
    const userAccount = await this.repository.createQueryBuilder('useraccount')
      .where('useraccount.id = :id', { id })
      .select([
        'useraccount.nomor',
      ])
      .getOne();

    return userAccount ?
      userAccount.nomor :
      null;
  }
}
