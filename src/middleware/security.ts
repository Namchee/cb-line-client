import { Request, Response, NextFunction } from 'express';
import { createError } from './error';
const insecure = 'Request is not sent via secure protocol.';

export function encryptedOnly(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.secure) {
    return next(createError(insecure, 401));
  } else {
    next();
  }
}
