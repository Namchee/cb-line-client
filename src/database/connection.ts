import { createConnection } from 'typeorm';
import config from './../config/config';
import { User } from './entity/user';
import { Account } from './entity/account';
import { Client } from './entity/client';
import { Kelas } from './entity/kelas';
import { MataKuliah } from './entity/mata-kuliah';
import { Ruangan } from './entity/ruangan';

export const connection = createConnection({
  type: 'postgres',
  url: config.dbURL,
  entities: [
    User,
    Account,
    Client,
    Kelas,
    MataKuliah,
    Ruangan,
  ],
});
