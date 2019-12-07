import { Repository, EntityRepository, EntityManager } from 'typeorm';
import { Client } from '../entity/client';
import { toEntity } from '../services/mapper/client';
import { Client as ClientDocument } from '../database/entity/client';
import { CustomRepository } from './base';

@EntityRepository()
export class ClientRepository extends CustomRepository {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  private get repository(): Repository<ClientDocument> {
    return this.manager.getRepository(ClientDocument);
  }

  public exist = async (provider: string, id: string): Promise<boolean> => {
    const count = await this.repository.count(
      {
        nama: provider,
        client_id: id,
      });

    return count >= 1;
  }

  public findByUrl = async (url: string): Promise<Client | null> => {
    const clientDocument = await this.repository.createQueryBuilder('client')
      .where('client.url = url', { url })
      .select([
        'client.client_id',
        'client.url',
      ])
      .getOne();

    return clientDocument ?
      toEntity(clientDocument) :
      null;
  }

  public findByProvider = async (
    provider: string
  ): Promise<Client[]> => {
    const clientEntity = await this.repository.createQueryBuilder('client')
      .where('client.nama = :provider', { provider })
      .select([
        'client.client_id',
        'client.url',
      ])
      .getMany();

    const result: Client[] = [];

    for (const client of clientEntity) {
      result.push(toEntity(client));
    }

    return result;
  }
}
