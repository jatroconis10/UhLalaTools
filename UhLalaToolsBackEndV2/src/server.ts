import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import { applicationsRouter, webApplicationsRouter } from './routes';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;
mongoose.connect('mongodb://localhost:27017/uhlala-api');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/applications', applicationsRouter);
app.use('/web-applications', webApplicationsRouter);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
