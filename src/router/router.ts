import express from 'express';
import { encryptedOnly } from '../middleware/security';

const router = express.Router();

router.post('/hub', encryptedOnly);

export { router };
