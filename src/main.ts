import express from 'express';
import logger from 'morgan';

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(logger('dev'));
}

app.listen(3000, (): void => {
  console.log('Listening at 3000');
});
