import { Client as ClientDatabase } from '../../database/entity/client';
import { Client as ClientEntity } from './../../entity/client';

export function toEntity(clientDocument: ClientDatabase): ClientEntity {
  return ClientEntity.createClient(
    clientDocument.nama,
    clientDocument.client_id,
    clientDocument.url
  );
}
