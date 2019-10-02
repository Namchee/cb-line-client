import { Request, Response, NextFunction } from 'express';
import { ErrorExt } from '../types/error';

export function errorHandler(
  err: ErrorExt,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  console.log(err.message);
  err.status = err.status || 500;

  return res.status(err.status)
    .json({
      data: null,
      error: err.message,
    });
}
