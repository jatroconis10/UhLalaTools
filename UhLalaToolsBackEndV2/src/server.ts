import express from 'express';
import * as bodyParser from 'body-parser';

import { WebApplicationsController } from './controllers';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/web-applications', WebApplicationsController);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
