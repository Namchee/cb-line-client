import { Account as AccountDatabase } from '../database/entity/account';
import { Account as AccountEntity } from '../entity/account';
import { toEntity } from './mapper/account';
import {
  EntityManager,
  Repository as BaseRepository,
  EntityRepository,
} from 'typeorm';
import { User } from '../entity/user';
import { Repository } from './base';

@EntityRepository(AccountDatabase)
export class AccountRepository extends Repository<AccountDatabase> {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  protected get repository(): BaseRepository<AccountDatabase> {
    return this.manager.getRepository(AccountDatabase);
  }

  public exist = async (id: string): Promise<boolean> => {
    const count = await this.repository.count({ account: id });

    return count >= 1;
  }

  public findOne = async (id: string): Promise<AccountEntity | null> => {
    const accountEntity = await this.repository.createQueryBuilder('account')
      .where('account.account = :account_id', { account_id: id })
      .select([
        'account.account',
        'account.userid',
      ])
      .getOne();

    return accountEntity ?
      toEntity(accountEntity) :
      null;
  }

  public findClientAccount = async (
    provider: string,
    user: User
  ): Promise<AccountEntity | null> => {
    const accountPattern = '\'' + provider + '@%\'';

    const accountEntity = await this.repository.createQueryBuilder('account')
      .where(`account.account LIKE ${accountPattern}`)
      .andWhere(`account.userId = ${user.id}`)
      .select([
        'account.account',
      ])
      .getOne();

    return accountEntity ?
      toEntity(accountEntity) :
      null;
  }

  public addAccount = async (
    id: string,
    user: User
  ): Promise<AccountEntity | null> => {
    const exist = await this.exist(id);

    if (exist) {
      return null;
    }

    await this.repository.query(`
      INSERT INTO account
        (account, userId)
      VALUES
        ('${id}', '${user.id}')
    `);

    return this.findOne(id);
  }

  public moveAccount = async (
    id: string,
    oldUser: User,
    newUser: User
  ): Promise<AccountEntity | null> => {
    await this.repository.query(`
      UPDATE account
      SET
        userid = '${newUser.id}'
      WHERE
        userid = '${oldUser.id}'
    `);

    return this.findOne(id);
  }

  public deleteAccount = async (
    id: string
  ): Promise<AccountEntity | null> => {
    const deletedAccount = await this.findOne(id);

    if (deletedAccount === null) {
      return null;
    }

    await this.repository.createQueryBuilder('account')
      .delete()
      .from(AccountDatabase)
      .where('account.account = :account', { account: id })
      .execute();

    return deletedAccount;
  }
}
