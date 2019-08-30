import { LineMessage } from './line/messages/factory';

export abstract class ErrorHandler<T> {
  public abstract handleExpiredSession(): T;
  public abstract handleUnknownOpcode(): T;
  public abstract handleCustomError(error: Error): T;
}

export interface LineResponse {
  state: number;
  message: LineMessage;
}

export interface LineService {
  handle(
    id: string,
    state?: number,
    text?: string
  ): LineResponse | Promise<LineResponse>;
}
