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
  /**
   * A map which stores users state
   *
   * @private
   * @static
   * @memberof UserState
   */
  private static readonly userState = new Map<string, State>();

  /**
   * Create new state for a user
   *
   * @param {string} provider Provider information
   * @param {string} id User's ID
   * @param {string} service Service's identifier
   * @param {number} state Service's state
   * @param {string} text Accumulated text
   * @param {Date} last_updated Last request time
   */
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

  /**
   * Get a user's state
   *
   * @param {string} provider Provider information
   * @param {string} id User's ID
   * @return {State | undefined} User's state or `undefined`
   * if there's no saved state
   */
  public static getState(provider: string, id: string): State | undefined {
    return UserState.userState.get(`${provider}@${id}`);
  }

  /**
   * Update a user's state
   *
   * @param {string} provider Provider information
   * @param {string} id User's ID
   * @param {string} service Service identifier
   * @param {number} state Service state
   * @param {string} text Accumulated text
   * @param {Date} last_updated Last request time
   */
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

  /**
   * Delete a user's state
   * @param {string} provider Provider information
   * @param {string} id User's ID
   */
  public static deleteState(
    provider: string,
    id: string
  ): void {
    UserState.userState.delete(`${provider}@${id}`);
  }
}
