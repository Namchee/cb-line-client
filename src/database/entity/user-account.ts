import { ViewEntity, Connection, ViewColumn, BaseEntity } from 'typeorm';
import { Account } from './account';
import { User } from './user';

@ViewEntity({
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select('account.account', 'id')
    .addSelect('user.nomor', 'nomor')
    .from(User, 'user')
    .leftJoin(Account, 'account', 'account.userId = user.id'),
})
export class UserAccount extends BaseEntity {
  @ViewColumn()
  id: string;

  @ViewColumn()
  nomor: string;
}
