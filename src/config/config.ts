import { config } from 'dotenv';

const result = config({
  path: String.prototype.concat(__dirname, '\\config.env'),
});

if (result.error) {
  console.error('Cannot load config.env');
  process.exit(1);
}

export default {
  dbURL: process.env.DB_URL || '',
};
