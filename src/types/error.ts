export interface ErrorExt extends Error {
  status?: number;
}

export function createError(message: string, status?: number): ErrorExt {
  const error: ErrorExt = new Error(message);
  error.status = status;

  return error;
}
