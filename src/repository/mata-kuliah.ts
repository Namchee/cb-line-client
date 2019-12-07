import { CustomRepository } from './base';
import { EntityRepository, EntityManager, Repository } from 'typeorm';
import {
  MataKuliah as MataKuliahDocument,
} from '../database/entity/mata-kuliah';
import { User } from '../database/entity/user';
import { MataKuliah } from '../entity/mata-kuliah';
import { Kelas } from '../database/entity/kelas';
import { toEntity } from '../services/mapper/mata-kuliah';

@EntityRepository()
export class MataKuliahRepository extends CustomRepository {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  private get repository(): Repository<MataKuliahDocument> {
    return this.manager.getRepository(MataKuliahDocument);
  }

  public getUserMataKuliah = async (
    user: User
  ): Promise<MataKuliah[]> => {
    const subQuery = this.manager.getRepository(User)
      .createQueryBuilder('user')
      .subQuery()
      .where('user.id = :id', { id: user.id })
      .getQuery();

    const mataKuliahDocuments = await this.repository
      .createQueryBuilder('matakuliah')
      .innerJoin(Kelas, 'kelas', 'kelas.matakuliah = matakuliah.id')
      .innerJoin(
        'pesertakelas',
        'pesertakelas',
        'pesertakelas.kelasId = kelas.id',
      )
      .innerJoin('(' + subQuery + ')', 'selected_user')
      .getMany();

    const mataKuliahList: MataKuliah[] = [];

    for (const document of mataKuliahDocuments) {
      mataKuliahList.push(toEntity(document));
    }

    return mataKuliahList;
  }
}
