import { CustomRepository } from './base';
import { EntityManager, Repository, EntityRepository } from 'typeorm';
import {
  Pengumuman as PengumumanDocument,
} from '../database/entity/pengumuman';
import { Pengumuman } from '../entity/pengumuman';
import { toEntity } from '../services/mapper/pengumuman';

@EntityRepository()
export class PengumumanRepository extends CustomRepository {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  private get repository(): Repository<PengumumanDocument> {
    return this.manager.getRepository(PengumumanDocument);
  }

  public findPengumumanByMataKuliah = async (
    kode: string
  ): Promise<Pengumuman | null> => {
    const pengumumanDocument = await this.repository
      .createQueryBuilder('pengumuman')
      .innerJoinAndSelect('pengumuman.matakuliahid', 'matakuliah')
      .where('matakuliah.kode = :kode', { kode })
      .orderBy('pengumuman.tanggal', 'DESC')
      .getOne();

    return pengumumanDocument ?
      toEntity(pengumumanDocument) :
      null;
  }
}
