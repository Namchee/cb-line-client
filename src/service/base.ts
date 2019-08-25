export abstract class Service<T> {
  private readonly state: number;
  private text: string;

  public constructor(state: number, text: string) {
    this.state = state;
    this.text = text;
  }

  public abstract handle<T>(): T
}
