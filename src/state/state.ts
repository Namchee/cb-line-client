/**
 * A type declaration for user state
 */
export interface State {
  /**
   * The identifier for current service which binds the user
   */
  service: string;
  /**
   * The state number for service handler
   */
  state: number;
  /**
   * The accumulated text
   */
  text: string;
  /**
   * Last request time, to check if the request has been expired or not
   */
  last_updated: Date;
}

/**
 * Class which manages user states
 * It uses provider and user id to map the user's state
 */
export class UserState {
  private static readonly userState = new Map<string, State>();

  public static createNewState(
    provider: string,
    id: string,
    service: string,
    state: number,
    text: string,
    last_updated: Date,
  ): void {
    UserState.userState.set(
      `${provider}@${id}`,
      {
        service,
        state,
        text,
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
    text: string,
    last_updated: Date,
  ): void {
    UserState.userState.set(
      `${provider}@${id}`,
      {
        service,
        state,
        text,
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
