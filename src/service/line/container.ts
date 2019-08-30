import { LineDaftarService } from './daftar';
import { LineGantiService } from './ganti';
import { LineHapusService } from './hapus';
import { LineService } from '../service';
import { repositoryContainer } from './../../repository/container';

const lineServiceContainer = new Map<string, LineService>();

const daftarService = new LineDaftarService(repositoryContainer.userRepository);
const gantiService = new LineGantiService(repositoryContainer.userRepository);
const hapusService = new LineHapusService(repositoryContainer.userRepository);

lineServiceContainer.set('daftar', daftarService);
lineServiceContainer.set('ganti', gantiService);
lineServiceContainer.set('hapus', hapusService);

export { lineServiceContainer };
