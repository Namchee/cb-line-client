import {
  Repository as BaseRepository,
  EntityRepository,
  EntityManager,
} from 'typeorm';
import { Client as ClientEntity } from '../entity/client';
import { toEntity } from './mapper/client';
import { Client as ClientDatabase } from '../database/entity/client';
import { Repository } from './base';

@EntityRepository(ClientDatabase)
export class ClientRepository
  extends Repository<ClientDatabase> {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  protected get repository(): BaseRepository<ClientDatabase> {
    return this.manager.getRepository(ClientDatabase);
  }

  public exist = async (id: string): Promise<boolean> => {
    const count = await this.repository.count({ client_id: id });

    return count >= 1;
  }

  public findOne = async (url: string): Promise<ClientEntity | null> => {
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
  ): Promise<ClientEntity[]> => {
    const clientEntity = await this.repository.createQueryBuilder('client')
      .where('client.nama = :provider', { provider })
      .select([
        'client.client_id',
        'client.url',
      ])
      .getMany();

    const result: ClientEntity[] = [];

    for (const client of clientEntity) {
      result.push(toEntity(client));
    }

    return result;
  }

  public create = async (id: string): Promise<ClientEntity | null> => {
    const exist: boolean = await this.exist(id);

    if (exist) {
      return null;
    }

    const insertedEntity = await this.repository.createQueryBuilder('client')
      .insert()
      .into(ClientDatabase)
      .values(
        { client_id: id },
      )
      .returning([
        'client.nama',
        'client.client_id',
        'client.url',
      ])
      .execute();

    return toEntity(insertedEntity.generatedMaps[0] as ClientDatabase);
  }

  public delete = async (url: string): Promise<ClientEntity | null> => {
    const deletedEntity = await this.repository.createQueryBuilder('client')
      .where('client.url = :url', { url })
      .select([
        'client.nama',
        'client.client_id',
        'client.url',
      ])
      .getOne();

    await this.repository.createQueryBuilder('client')
      .delete()
      .from(ClientDatabase)
      .where('client.url = :url', { url })
      .execute();

    return deletedEntity ?
      toEntity(deletedEntity) :
      null;
  }
}
