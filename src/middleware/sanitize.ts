import { NextFunction } from 'connect';
import { sanitize } from 'express-validator';

export function sanitizeInput(
  req: Express.Request,
  res: Express.Response,
  next: NextFunction): void {
  sanitize('*').trim().escape();

  next();
}
