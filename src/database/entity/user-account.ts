import { ViewEntity, Connection, ViewColumn } from 'typeorm';
import { Account } from './account';
import { User } from './user';

@ViewEntity({
  name: 'user_account',
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select('account.account')
    .addSelect('account.provider')
    .addSelect('user.id')
    .addSelect('user.nomor')
    .addSelect('user.nama')
    .addSelect('user.role')
    .from(User, 'user')
    .leftJoin(Account, 'account', 'account.userId = user.id'),
})
export class UserAccount {
  @ViewColumn()
  id: string;

  @ViewColumn()
  account: string;

  @ViewColumn()
  provider: string;

  @ViewColumn()
  nomor: string;

  @ViewColumn()
  nama: string;

  @ViewColumn()
  role: string;
}
