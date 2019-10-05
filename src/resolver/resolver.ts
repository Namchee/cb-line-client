import express from 'express';

import { respond } from './respond';

/**
 * Maps each request with their resolvers
 *
 * @export
 * @param {express.Request} req Express request
 * @param {express.Response} res Express response
 * @return {Promise<void | Response>}
 */
export function mapRequest(
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> {
  return Promise.all(req.body.events.map(respond))
    .then(result => res.status(200).json(result))
    .catch((err) => {
      console.error(err);

      res.status(500).end();
    });
}
