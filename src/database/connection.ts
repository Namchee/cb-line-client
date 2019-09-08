import { createConnection } from 'mongoose';
import config from './../config/config';

export const connection = createConnection(config.dbURL, {
  useNewUrlParser: true,
});
