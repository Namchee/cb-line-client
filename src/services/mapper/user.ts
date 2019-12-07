import { User as UserDocument } from './../../database/entity/user';
import { User } from './../../entity/user';

export function toEntity(document: UserDocument): User {
  return User.createUser(
    document.id,
    document.nomor,
    document.nama,
    document.role
  );
}
