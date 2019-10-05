export class ServerError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class UserError extends Error {
  public readonly status: number;

  public constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export function isUserError(object: any): object is UserError {
  return object &&
    object.message &&
    typeof object.message === 'string' &&
    object.status &&
    typeof object.status === 'number' &&
    object.status === 400;
}
