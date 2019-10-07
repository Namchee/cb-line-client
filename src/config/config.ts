import { config } from 'dotenv';

if (process.env.NODE_ENV === 'dev') {
  const result = config();

  if (result.error) {
    console.error('Cannot load environment variables');
    process.exit(1);
  }
}

export default {
  dbURL: process.env.DATABASE_URL || '',
};
