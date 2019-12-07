import { Account as AccountDocument } from '../../database/entity/account';
import { Account as Account } from '../../entity/account';

export function toEntity(document: AccountDocument): Account {
  return Account.createAccount(
    document.id,
    document.provider,
    document.account,
  );
}
