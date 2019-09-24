import { Client, ClientConfig } from '@line/bot-sdk';
import { clientConfig } from './../config/config';

const config: ClientConfig = clientConfig;

const lineClient = new Client(config);

export { lineClient };
