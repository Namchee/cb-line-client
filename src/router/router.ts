import express from 'express';
import { encryptedOnly } from '../middleware/security';
import { sanitizeInput } from '../middleware/sanitize';

const router = express.Router();

router.use(sanitizeInput);
router.post('/hub', encryptedOnly);

export { router };
