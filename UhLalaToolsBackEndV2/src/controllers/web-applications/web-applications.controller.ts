import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Request, Response } from 'express';

import { WebApplication, WebApplicationSchema } from '../../models/web-application.model';

const WebApplication: Model<WebApplication> = mongoose.model('WebApplication', WebApplicationSchema);
export class WebApplicationsController {
  public static getWebApplications(req: Request, res: Response) {
    res.status(200).send({
      message: 'GET request successfulll!!!!'
    });
  }

  public static getWebApplication(req: Request, res: Response) { }

  public static createWebApplication(req: Request, res: Response) {
    const webApplication = new WebApplication(req.body);
    webApplication.save((err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json(contact);
    });
  }
}
