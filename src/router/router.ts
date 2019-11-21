import { Router } from 'express';
import { encryptedOnly } from '../middleware/security';
import { sanitizeInput } from '../middleware/sanitize';
import { Resolver } from '../resolver/resolver';
import { checkRequestFormat } from '../middleware/body';
import { ClientRepository } from '../repository/client';
import { connection } from '../database/connection';
import { initializeServices } from '../services/container';
import { ServiceFactory } from '../services/factory';

export async function initializeRoutes(): Promise<Router> {
  const router = Router();

  const conn = await connection;
  const serviceContainer = initializeServices(conn);

  const clientRepository = conn.getCustomRepository(ClientRepository);
  const serviceFactory = new ServiceFactory(serviceContainer);

  const resolver = new Resolver(clientRepository, serviceFactory);

  router.use(sanitizeInput);
  router.post('/hub', checkRequestFormat, resolver.handle);

  return router;
}
