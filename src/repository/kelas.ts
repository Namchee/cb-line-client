import { CustomRepository } from './base';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { Kelas as KelasDocument } from '../database/entity/kelas';
import { Ruangan } from '../entity/ruangan';
import { Kelas } from '../entity/kelas';
import { toEntity } from '../services/mapper/kelas';

@EntityRepository()
export class KelasRepository extends CustomRepository {
  public constructor(manager: EntityManager) {
    super(manager);
  }

  private get repository(): Repository<KelasDocument> {
    return this.manager.getRepository(KelasDocument);
  }

  public findJadwal = async (
    ruangan: Ruangan,
    dayOfWeek: number,
  ): Promise<Kelas[]> => {
    const schedules = await this.repository
      .createQueryBuilder('kelas')
      .innerJoinAndSelect('kelas.ruangan', 'ruangan')
      .where('ruangan.nama = :nama', { nama: ruangan.nama })
      .andWhere('kelas.hari = :hari', { hari: dayOfWeek })
      .select([
        'kelas.waktumulai',
        'kelas.waktuselesai',
      ])
      .getMany();

    const kelasArray: Kelas[] = [];

    for (const schedule of schedules) {
      kelasArray.push(toEntity(schedule));
    }

    return kelasArray;
  }
}
