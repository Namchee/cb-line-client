import { Model } from 'mongoose';
import { ClientDocument } from '../model/client';
import { toEntity } from './mapper/client';

export class ClientRepository {
  private readonly model: Model<ClientDocument>;

  public constructor(model: Model<ClientDocument>) {
    this.model = model;
  }

  public async exist(id: string): Promise<boolean> {
    return this.model.exists({
      client_id: id,
    });
  }

  public async find(id: string): Promise<Client | null> {
    const clientDocument = await this.model.findOne({
      client_id: id,
    });

    return clientDocument ?
      toEntity(clientDocument) :
      null;
  }

  public async create(id: string): Promise<Client | null> {
    const exist: boolean = await this.exist(id);

    if (exist) {
      return null;
    }

    const newClient = {
      client_id: id,
    };

    const insertedDocument = await this.model.create(newClient);

    return toEntity(insertedDocument);
  }

  public async delete(id: string): Promise<Client | null> {
    const deletedClient = await this.model.findOneAndDelete({
      client_id: id,
    });

    return deletedClient ?
      toEntity(deletedClient) :
      null;
  }
}
