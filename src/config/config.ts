import { config, DotenvConfigOutput } from 'dotenv';

if (process.env.NODE_ENV === 'dev') {
  const configResult: DotenvConfigOutput = config();

  if (configResult.error) {
    console.error('Cannot load configuration file');
  }
}

export const clientConfig = {
  channelAccessToken: process.env.ACCESS_TOKEN || '',
  channelSecret: process.env.SECRET || '',
  serviceURL: process.env.SERVICE_URL || '',
};
