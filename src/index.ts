import 'regenerator-runtime';
import express from 'express';
import logger from 'morgan';
import { router } from './router/router';

const app = express();

app.use(router);

if (process.env.NODE_ENV === 'dev') {
  app.use(logger('dev'));
}

app.listen(3000, () => {
  console.log(`start at 3000`);
});

