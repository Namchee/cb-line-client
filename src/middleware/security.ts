import { Request, Response, NextFunction } from 'express';
import { ServerError } from '../types/error';

const insecure = 'Request is not sent via secure protocol.';

export function encryptedOnly(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.secure) {
    return next(new ServerError(insecure, 401));
  }

  next();
}
