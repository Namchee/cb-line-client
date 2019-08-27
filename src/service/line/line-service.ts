import { LineMessage } from './messages/factory';

export interface LineResponse {
  state: number;
  message: LineMessage;
}

export abstract class LineService {
  protected abstract determineState(text: string): number;
  protected abstract formatMessage(
    type: string, content: string | string[]
  ): LineMessage;
  public abstract handle(state: number, text: string): LineResponse;
}
