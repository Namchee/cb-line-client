export interface State {
  service: string;
  state: number;
  text: string;
}

export class UserState {
  private static readonly userState = new Map<string, State>();

  public static createNewState(
    provider: string,
    id: string,
    service: string,
    state: number,
    text: string
  ): void {
    UserState.userState.set(
      `${provider}@${id}`,
      {
        service,
        state,
        text,
      },
    );
  }

  public static getState(provider: string, id: string): State | undefined {
    return UserState.userState.get(`${provider}@${id}`);
  }

  public static modifyState(
    provider: string,
    id: string,
    service: string,
    state: number,
    text: string
  ): void {
    UserState.userState.set(
      `${provider}@${id}`,
      {
        service,
        state,
        text,
      },
    );
  }
}
