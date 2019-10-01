import { Service } from './service';
import { DaftarService } from './user/daftar';
import { AccountRepository } from '../repository/account';
import { GantiService } from './user/ganti';
import { HapusService } from './user/hapus';
import { Connection } from 'typeorm';
import { UserRepository } from '../repository/user';
import { UserAccountRepository } from '../repository/user-account';

export async function initializeServices(
  conn: Connection
): Promise<Map<string, Service>> {
  const serviceContainer = new Map<string, Service>();

  const accountRepository = conn.getCustomRepository(AccountRepository);
  const userRepository = conn.getCustomRepository(UserRepository);
  const userAccountRepository = conn.getCustomRepository(UserAccountRepository);

  const daftarService = new DaftarService(accountRepository, userRepository);

  const gantiService = new GantiService(
    accountRepository,
    userRepository,
    userAccountRepository
  );

  const hapusService = new HapusService(
    accountRepository,
    userRepository,
    userAccountRepository
  );

  serviceContainer.set('daftar', daftarService);
  serviceContainer.set('ganti', gantiService);
  serviceContainer.set('hapus', hapusService);

  return serviceContainer;
}
