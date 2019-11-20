import { Service } from './service';
import { DaftarService } from './user/daftar';
import { GantiService } from './user/ganti';
import { HapusService } from './user/hapus';
import { Connection } from 'typeorm';
import { UserAccountRepository } from '../repository/user-account';
import { PengumumanService } from './smart/pengumuman';
import { JadwalService } from './smart/jadwal';

export function initializeServices(
  conn: Connection
): Map<string, Service> {
  const serviceContainer = new Map<string, Service>();

  const userAccountRepository = conn.getCustomRepository(UserAccountRepository);

  const daftarService = new DaftarService(userAccountRepository);
  const gantiService = new GantiService(userAccountRepository);
  const hapusService = new HapusService(userAccountRepository);

  // smart service

  const pengumumanService = new PengumumanService(userAccountRepository);
  const jadwalService = new JadwalService();

  serviceContainer.set('daftar', daftarService);
  serviceContainer.set('ganti', gantiService);
  serviceContainer.set('hapus', hapusService);

  serviceContainer.set('pengumuman', pengumumanService);
  serviceContainer.set('jadwal', jadwalService);

  return serviceContainer;
}
