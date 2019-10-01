import { Request, Response, NextFunction } from 'express';
import { createError } from './../types/error';
import { isRequestBody } from '../types/body';
import { RESPOND } from '../resolver/response';

export function checkRequestFormat(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!isRequestBody(req.body)) {
    return next(createError(RESPOND.NO_BODY, 400));
  }

  next();
}
