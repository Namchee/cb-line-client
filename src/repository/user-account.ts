import { EntityRepository, Repository, EntityManager } from 'typeorm';
import { Account as AccountDocument } from '../database/entity/account';
import { Account } from './../entity/account';
import { User as UserDocument } from './../database/entity/user';
import { User } from './../entity/user';
import { toEntity as toAccountEntity } from '../services/mapper/account';
import { toEntity as toUserEntity } from './../services/mapper/user';
import { CustomRepository } from './base';
import { ServerError } from '../types/error';

@EntityRepository()
export class UserAccountRepository extends CustomRepository {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  private get accountRepository(): Repository<AccountDocument> {
    return this.manager.getRepository(AccountDocument);
  }

  private get userRepository(): Repository<UserDocument> {
    return this.manager.getRepository(UserDocument);
  }

  public exist = async (
    provider: string,
    account: string
  ): Promise<boolean> => {
    const count = await this.accountRepository
      .createQueryBuilder('account')
      .leftJoin('account.user', 'user')
      .where('account.provider = :provider', { provider })
      .andWhere('account.account = :account', { account })
      .getCount();

    return count >= 1;
  }

  public findUserByNomor = async (
    nomor: string
  ): Promise<User | null> => {
    const user = await this.userRepository
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
  ): Promise<User | null> => {
    const userDocument = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.account', 'account')
      .where('account.account = :account', { account })
      .andWhere('account.provider = :provider', { provider })
      .select([
        'user.id',
        'user.nama',
        'user.role',
        'user.nomor',
      ])
      .getOne();

    return userDocument ?
      toUserEntity(userDocument) :
      null;
  }

  public findUserAccountByProvider = async (
    provider: string,
    nomor: string,
  ): Promise<Account | null> => {
    const userAccount = await this.accountRepository
      .createQueryBuilder('account')
      .leftJoin('account.user', 'user')
      .where('account.provider = :provider', { provider })
      .andWhere('user.nomor = :nomor', { nomor })
      .select([
        'account.id',
        'account.provider',
        'account.account',
      ])
      .getOne();

    return userAccount ?
      toAccountEntity(userAccount) :
      null;
  }

  public addUserAccount = async (
    provider: string,
    account: string,
    nomor: string
  ): Promise<boolean> => {
    const exist = await this.exist(provider, account);

    if (exist) {
      throw new ServerError('This user already has an account', 500);
    }

    const user = await this.findUserByNomor(nomor);

    if (!user) {
      throw new ServerError('This user does not exist', 500);
    }

    const insertResult = await this.accountRepository
      .createQueryBuilder('account')
      .insert()
      .into(AccountDocument)
      .values({
        provider,
        account,
        user: () => user.id.toString(),
      })
      .execute();

    return insertResult.generatedMaps.length > 0;
  }

  public deleteUserAccount = async (
    provider: string,
    account: string,
  ): Promise<boolean> => {
    const exist = await this.exist(provider, account);

    if (!exist) {
      throw new ServerError('Account does not exist', 500);
    }

    const deleteResult = await this.accountRepository
      .createQueryBuilder('account')
      .delete()
      .from(AccountDocument)
      .where('account.provider = :provider', { provider })
      .andWhere('account.account = :account', { account })
      .execute();

    return !!deleteResult.affected;
  }

  public updateUserAccount = async (
    account: string,
    provider: string,
    oldUser: User,
    newUser: User,
  ): Promise<boolean> => {
    const targetAccount = await this.findUserAccountByProvider(
      provider,
      oldUser.nomor,
    );

    if (!targetAccount) {
      throw new ServerError('Account does not exist', 500);
    }

    await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.account', 'account')
      .where('account.provider = :provider', { provider })
      .andWhere('account.account = :account', { account })
      .relation(AccountDocument, 'user')
      .of(targetAccount.id)
      .set(newUser.id);

    return true;
  }
}
