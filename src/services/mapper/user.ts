import { User as UserDatabase } from './../../database/entity/user';
import { User as UserEntity } from './../../entity/user';

export function toEntity(userDatabase: UserDatabase): UserEntity {
  return UserEntity.createUser(
    userDatabase.id,
    userDatabase.nomor,
    userDatabase.nama,
    userDatabase.role
  );
}
