/**
 * An error which is thrown when handling server errors
 */
export class ServerError extends Error {
  /**
   * Status number for response
   *
   * @type {number}
   * @memberof ServerError
   */
  public readonly status: number;

  /**
   * Constructor for ServerError
   * @param {string} message Cause of the error
   * @param {number} status Status number for the error
   */
  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * An error which is thrown when handling input or user errors
 */
export class UserError extends Error {
  /**
   * Status number for the error, always 400
   *
   * @type {number}
   * @memberof UserError
   */
  public readonly status: number;

  /**
   * Constructor for UserError
   *
   * @param {string} message Cause of the error
   */
  public constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

/**
 * A type guard for `UserError`
 *
 * @param {object} object The object in question
 * @return {object} The object casted to `UserError` if `true`,
 * `false` otherwise
 */
export function isUserError(object: any): object is UserError {
  return object &&
    object.message &&
    typeof object.message === 'string' &&
    object.status &&
    typeof object.status === 'number' &&
    object.status === 400;
}
