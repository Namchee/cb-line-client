import { EntityRepository, Repository, EntityManager } from 'typeorm';
import { Ruangan as RuanganDocument } from '../database/entity/ruangan';
import { Ruangan } from '../entity/ruangan';
import { toEntity } from '../services/mapper/ruangan';
import { CustomRepository } from './base';

@EntityRepository()
export class RuanganRepository extends CustomRepository {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  private get repository(): Repository<RuanganDocument> {
    return this.manager.getRepository(RuanganDocument);
  }

  public exist = async (nama: string): Promise<boolean> => {
    const count = await this.repository.count({ nama });

    return count >= 1;
  }

  public findAll = async (): Promise<Ruangan[]> => {
    const ruanganDocuments = await this.repository
      .createQueryBuilder('ruangan')
      .orderBy('ruangan.nama', 'ASC')
      .getMany();

    const ruanganEntities = [];

    for (const document of ruanganDocuments) {
      ruanganEntities.push(toEntity(document));
    }

    return ruanganEntities;
  }
}
