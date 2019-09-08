import { Request, Response, NextFunction } from 'express';
import { Error } from './../types/error';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  err.status = err.status || 500;

  return res.status(err.status)
    .json({
      data: null,
      error: err.message,
    });
}
