import { UserDocument } from '../../model/user';

export function toEntity(userDocument: UserDocument): User {
  return {
    user_id: userDocument.user_id,
    npm: userDocument.npm,
  };
}
