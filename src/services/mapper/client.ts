import { Client as ClientDocument } from '../../database/entity/client';
import { Client } from './../../entity/client';

export function toEntity(document: ClientDocument): Client {
  return Client.createClient(
    document.nama,
    document.client_id,
    document.url
  );
}
