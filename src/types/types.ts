import { Message } from '@line/bot-sdk';

export interface RequestBody {
  provider: string;
  client: string;
  message: {
    userId: string;
    message: string;
  };
}

export interface ResponseBody {
  data: Message;
  error: string;
}
