import { LineMessage } from './messages/factory';

export interface LineResponse {
  state: number;
  message: LineMessage;
}
