import express from 'express';
import { encryptedOnly } from '../middleware/security';
import { sanitizeInput } from '../middleware/sanitize';
import { repositoryContainer } from '../repository/container';
import { TYPES } from '../types/symbol';
import { Resolver } from '../resolver/resolver';
import { ClientRepository } from '../repository/db/client';
import { errorHandler } from '../middleware/error';

const router = express.Router();

const clientRepository = repositoryContainer.get(TYPES.clientRepository);

const resolver = new Resolver(clientRepository as ClientRepository);

router.use(errorHandler);
router.use(sanitizeInput);
router.post('/hub', encryptedOnly, resolver.handle);

export { router };
