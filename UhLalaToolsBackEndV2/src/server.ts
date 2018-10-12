import express from 'express';
import * as bodyParser from 'body-parser';

import { webApplicationsRouter } from './routes/web-application.router';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/web-applications', webApplicationsRouter);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
