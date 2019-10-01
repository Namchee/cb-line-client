import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { initializeRoutes } from './router/router';
import { errorHandler } from './middleware/error';

initializeRoutes().then((router) => {
  const app = express();

  if (process.env.NODE_ENV === 'dev') {
    app.use(logger('dev'));
  }

  app.use(bodyParser.json());

  app.use(router);
  app.use(errorHandler);

  app.listen(3000, (): void => {
    console.log('Listening at 3000');
  });
});
