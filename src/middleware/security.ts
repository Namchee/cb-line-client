import { Request, Response, NextFunction } from 'express';

export function encryptedOnly(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.secure) {
    res.status(400)
      .json({
        data: null,
        errors: [
          'Request is not sent via secure protocol',
        ],
      });
  } else {
    next();
  }
}
