export interface Error {
  message: string | object;
  status?: number;
}

export function createError(message: string | object, status?: number): Error {
  return {
    message,
    status,
  };
}
