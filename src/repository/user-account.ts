import {
  EntityRepository,
  EntityManager,
  Repository as BaseRepository,
} from 'typeorm';
import { UserAccount } from '../database/entity/user-account';
import { Repository } from './base';
import { Account as AccountDatabase } from '../database/entity/account';
import { Account as AccountEntity } from './../entity/account';
import { User as UserDatabase } from './../database/entity/user';
import { User as UserEntity } from './../entity/user';
import { toEntity as toAccountEntity } from '../services/mapper/account';
import { toEntity as toUserEntity } from './../services/mapper/user';

@EntityRepository()
export class UserAccountRepository
  extends Repository {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  private get userAccountRepository(): BaseRepository<UserAccount> {
    return this.manager.getRepository(UserAccount);
  }

  private get accountRepository(): BaseRepository<AccountDatabase> {
    return this.manager.getRepository(AccountDatabase);
  }

  public exist = async (
    provider: string,
    account: string
  ): Promise<boolean> => {
    const count = await this.userAccountRepository
      .createQueryBuilder('useraccount')
      .where('useraccount.provider = :provider', { provider })
      .andWhere('useraccount.account = :account', { account })
      .getOne();

    return count !== undefined;
  }

  public findUserByNomor = async (
    nomor: string
  ): Promise<UserEntity | null> => {
    const user = await this.manager.getRepository(UserDatabase)
      .createQueryBuilder('user')
      .where('user.nomor = :nomor', { nomor })
      .select([
        'user.id',
        'user.nama',
        'user.role',
        'user.nomor',
      ])
      .getOne();

    return user ?
      toUserEntity(user) :
      null;
  }

  public findUserByAccount = async (
    provider: string,
    account: string
  ): Promise<UserEntity | null> => {
    const user = await this.userAccountRepository
      .createQueryBuilder('useraccount')
      .where('useraccount.account = :account', { account })
      .andWhere('useraccount.provider = :provider', { provider })
      .select([
        'useraccount.id',
        'useraccount.nama',
        'useraccount.role',
        'useraccount.nomor',
      ])
      .getOne();

    const cast = user as unknown as UserDatabase;

    return cast ?
      toUserEntity(cast) :
      null;
  }

  public findClientAccount = async (
    provider: string,
    user: UserEntity
  ): Promise<AccountEntity | null> => {
    const clientAccount = await this.userAccountRepository
      .createQueryBuilder('useraccount')
      .where('useraccount.provider = :provider', { provider })
      .andWhere('useraccount.nomor = :nomor', { nomor: user.nomor })
      .select([
        'useraccount.provider',
        'useraccount.account',
      ])
      .getOne();

    const cast = clientAccount as unknown as AccountDatabase;

    return cast ?
      toAccountEntity(cast) :
      null;
  }

  public add = async (
    provider: string,
    account: string,
    user: UserEntity
  ): Promise<boolean> => {
    const exist = await this.exist(provider, account);

    if (exist) {
      return false;
    }

    await this.accountRepository.query(`
      INSERT INTO account
        (provider, account, userId)
      VALUES
        ('${provider}', '${account}', '${user.id}')
    `);

    return true;
  }

  public delete = async (
    provider: string,
    account: string,
  ): Promise<boolean> => {
    const exist = await this.exist(provider, account);

    if (!exist) {
      return false;
    }

    await this.accountRepository.createQueryBuilder('account')
      .delete()
      .from(AccountDatabase)
      .where('account.provider = :provider', { provider })
      .andWhere('account.account = :account', { account })
      .execute();

    return true;
  }

  public move = async (
    provider: string,
    account: string,
    oldUser: UserEntity,
    newUser: UserEntity
  ): Promise<boolean> => {
    const exist = await this.exist(provider, account);

    if (!exist) {
      return false;
    }

    await this.accountRepository.query(`
      UPDATE account
      SET
        userid = '${newUser.id}'
      WHERE
        userid = '${oldUser.id}'
    `);

    return true;
  }
}
