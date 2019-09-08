export interface State {
  service: string;
  state: number;
  last_updated: Date;
}

export class UserState {
  private static readonly userState = new Map<string, State>();

  public static createNewState(
    provider: string,
    id: string,
    service: string,
    state: number,
    last_updated: Date,
  ): void {
    UserState.userState.set(
      `${provider}@${id}`,
      {
        service,
        state,
        last_updated,
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
    last_updated: Date,
  ): void {
    UserState.userState.set(
      `${provider}@${id}`,
      {
        service,
        state,
        last_updated,
      },
    );
  }

  public static deleteState(
    provider: string,
    id: string
  ): void {
    UserState.userState.delete(`${provider}@${id}`);
  }
}
