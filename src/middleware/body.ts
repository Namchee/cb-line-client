import { Request, Response, NextFunction } from 'express';
import { isRequestBody } from '../types/body';
import { RESPOND } from '../resolver/response';
import { ServerError } from '../types/error';

export function checkRequestFormat(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!isRequestBody(req.body)) {
    return next(new ServerError(RESPOND.NO_BODY, 406));
  }

  next();
}
