import { repositoryContainer } from '../repository/container';
import { Service } from './service';
import { DaftarService } from './user/daftar';
import { TYPES } from '../types/symbol';
import { UserRepository } from '../repository/db/user';
import { GantiService } from './user/ganti';
import { HapusService } from './user/hapus';

const serviceContainer = new Map<string, Service>();

const daftarService = new DaftarService(
  repositoryContainer.get(TYPES.userRepository) as UserRepository
);

const gantiService = new GantiService(
  repositoryContainer.get(TYPES.userRepository) as UserRepository
);

const hapusService = new HapusService(
  repositoryContainer.get(TYPES.userRepository) as UserRepository
);

serviceContainer.set('daftar', daftarService);
serviceContainer.set('ganti', gantiService);
serviceContainer.set('hapus', hapusService);

export { serviceContainer };
