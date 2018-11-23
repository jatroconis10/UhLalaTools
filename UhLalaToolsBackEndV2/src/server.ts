import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { NextFunction } from 'connect';

import { applicationsRouter, webApplicationsRouter, e2eTestsRouter, randomTestRouter } from './routes';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;
mongoose.connect('mongodb://localhost:27017/uhlala-api');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/applications', applicationsRouter);
app.use('/web-applications', webApplicationsRouter);
app.use('/e2e-tests', e2eTestsRouter);
app.use('/random-tests', randomTestRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return res.status(err.httpStatusCode || 500).json({
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
