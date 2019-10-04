import 'regenerator-runtime';
import express from 'express';
import logger from 'morgan';
import { router } from './router/router';

const app = express();

app.use(router);

if (process.env.NODE_ENV === 'dev') {
  app.use(logger('dev'));
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`start at ${port}`);
});

