import { Request, Response, NextFunction } from 'express';
import { ServerError } from '../types/error';

export function errorHandler(
  err: ServerError,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  return res.status(err.status)
    .json({
      data: null,
      error: err.message,
    });
}
