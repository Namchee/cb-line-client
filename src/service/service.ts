export interface Service<T, U> {
  handle(id: string): T;
  formatMessage(): U;
}

export abstract class ErrorHandler<T> {
  public abstract handleExpiredSession(): T;
  public abstract handleUnknownOpcode(): T;
  public abstract handleCustomError(error: Error): T;
}

export abstract class StatefulService {
  protected state: number;
  protected readonly text: string;

  public constructor(state: number, text: string) {
    this.state = state;
    this.text = text;
  }
}
