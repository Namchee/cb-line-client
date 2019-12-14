import { Request, Response, NextFunction } from 'express';
import { ServerError } from '../types/error';

export function errorHandler(
  err: ServerError,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  if (err.status === 500) {
    console.error(err);

    return res.status(500)
      .json({
        data: null,
        message: 'Terdapat error pada server, mohon hubungi developer',
      });
  } else {
    return res.status(err.status)
      .json({
        data: null,
        error: err.message,
      });
  }
}
