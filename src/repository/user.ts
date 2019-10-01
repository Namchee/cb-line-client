import { User as UserDatabase } from '../database/entity/user';
import { User as UserEntity } from '../entity/user';
import {
  EntityManager,
  Repository as BaseRepository,
  EntityRepository,
} from 'typeorm';
import { toEntity } from './mapper/user';
import { Repository } from './base';

@EntityRepository(UserDatabase)
export class UserRepository
  extends Repository<UserDatabase> {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  protected get repository(): BaseRepository<UserDatabase> {
    return this.manager.getRepository(UserDatabase);
  }

  public exist = async (id: string): Promise<boolean> => {
    const count = await this.repository.count({ nomor: id });

    return count >= 1;
  }

  public findOne = async (nomor: string): Promise<UserEntity | null> => {
    const userEntity = await this.repository.createQueryBuilder('user')
      .where('user.nomor = :nomor', { nomor })
      .select([
        'user.nomor',
        'user.nama',
        'user.role',
      ])
      .getOne();

    return userEntity ?
      toEntity(userEntity) :
      null;
  }
}
