import { Service } from './base';
import { DaftarService } from './user/daftar';
import { GantiService } from './user/ganti';
import { HapusService } from './user/hapus';
import { Connection } from 'typeorm';
import { UserAccountRepository } from '../repository/user-account';
import { PengumumanService } from './smart/pengumuman';
import { JadwalService } from './smart/jadwal';
import { RuanganRepository } from '../repository/ruangan';
import { KelasRepository } from '../repository/kelas';
import { MataKuliahRepository } from '../repository/mata-kuliah';

export function initializeServices(
  conn: Connection
): Service[] {
  const serviceContainer: Service[] = [];

  const userAccountRepository = conn.getCustomRepository(UserAccountRepository);
  const ruanganRepository = conn.getCustomRepository(RuanganRepository);
  const kelasRepository = conn.getCustomRepository(KelasRepository);
  const mataKuliahRepository = conn.getCustomRepository(MataKuliahRepository);

  const daftarService = new DaftarService(userAccountRepository);
  const gantiService = new GantiService(userAccountRepository);
  const hapusService = new HapusService(userAccountRepository);

  // smart service

  const pengumumanService = new PengumumanService(
    userAccountRepository,
    mataKuliahRepository
  );
  const jadwalService = new JadwalService(ruanganRepository, kelasRepository);

  serviceContainer.push(daftarService);
  serviceContainer.push(gantiService);
  serviceContainer.push(hapusService);
  serviceContainer.push(pengumumanService);
  serviceContainer.push(jadwalService);

  return serviceContainer;
}
