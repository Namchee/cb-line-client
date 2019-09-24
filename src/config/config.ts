import { config, DotenvConfigOutput } from 'dotenv';
import { resolve } from 'path';

if (process.env.NODE_ENV === 'dev') {
  const configResult: DotenvConfigOutput = config({
    path: resolve(process.cwd(), 'cfg/config.env'),
  });

  if (configResult.error) {
    console.error('Cannot load configuration file');
  }
}

export const clientConfig = {
  channelAccessToken: process.env.ACCESS_TOKEN || '',
  channelSecret: process.env.SECRET || '',
};
