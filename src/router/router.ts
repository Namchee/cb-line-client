import express from 'express';
import { middleware } from '@line/bot-sdk';
import { mapRequest } from '../resolver/resolver';
import { clientConfig } from './../config/config';

const router = express.Router();

router.post('/webhook', middleware(clientConfig), mapRequest);

export { router };
