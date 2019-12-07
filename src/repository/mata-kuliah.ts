import { CustomRepository } from './base';
import { EntityRepository, EntityManager, Repository } from 'typeorm';
import {
  Matakuliah as MataKuliahDocument,
} from '../database/entity/mata-kuliah';
import { User } from '../entity/user';
import { User as UserDocument } from './../database/entity/user';
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

  public findByKode = async (
    kode: string
  ): Promise<MataKuliah | null> => {
    const mataKuliahDocument = await this.repository
      .createQueryBuilder('matakuliah')
      .where('matakuliah.kode = :kode', { kode })
      .getOne();

    return mataKuliahDocument ?
      toEntity(mataKuliahDocument) :
      null;
  }

  public findByNama = async (
    nama: string
  ): Promise<MataKuliah | null> => {
    const mataKuliahDocument = await this.repository
      .createQueryBuilder('matakuliah')
      .where(
        'UPPER(matakuliah.nama) LIKE %:nama%', { nama: nama.toUpperCase() }
      )
      .getOne();

    return mataKuliahDocument ?
      toEntity(mataKuliahDocument) :
      null;
  }

  public findUserMataKuliah = async (
    user: User
  ): Promise<MataKuliah[]> => {
    const subQuery = this.manager.getRepository(UserDocument)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: user.id });

    const mataKuliahDocuments = await this.repository
      .createQueryBuilder('matakuliah')
      .innerJoin(Kelas, 'kelas', 'kelas.matakuliah = matakuliah.id')
      .innerJoin(
        'pesertakelas',
        'pesertakelas',
        'pesertakelas.kelasid = kelas.id',
      )
      .innerJoin(
        '(' + subQuery.getQuery() + ')',
        'selected_user',
        'selected_user.user_id = pesertakelas.userid'
      )
      .setParameters(subQuery.getParameters())
      .getMany();

    const mataKuliahList: MataKuliah[] = [];

    for (const document of mataKuliahDocuments) {
      mataKuliahList.push(toEntity(document));
    }

    return mataKuliahList;
  }
}
