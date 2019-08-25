import { Service } from '../base';
import { LineMessage } from './messages/factory';

export interface LineResponse {
  state: number;
  message: LineMessage;
}

export abstract class LineService extends Service<LineResponse> {
  public abstract handle<LineResponse>(): LineResponse;
  public abstract formatMessage(): LineMessage
}
