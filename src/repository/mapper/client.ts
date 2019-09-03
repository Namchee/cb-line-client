import { ClientDocument, Client } from '../../model/client';

export function toEntity(clientDocument: ClientDocument): Client {
  return {
    client_id: clientDocument.client_id,
  };
}
