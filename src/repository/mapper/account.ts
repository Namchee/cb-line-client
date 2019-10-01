import { Account as AccountDatabase } from './../../database/entity/account';
import { Account as AccountEntity } from './../../entity/account';

export function toEntity(accountDocument: AccountDatabase): AccountEntity {
  return AccountEntity.createAccount(
    accountDocument.account,
    accountDocument.user.id,
  );
}
