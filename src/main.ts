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

  const port = process.env.PORT || 6969;

  app.listen(port, (): void => {
    console.log(`Listening at ${port}`);
  });
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
