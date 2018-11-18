import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { WebApplication } from '../models';

export class WebApplicationsController {
  public static getWebApplications(req: Request, res: Response) {
    WebApplication.find(req.query, ((err, webApplications) => {
      if (err) {
        res.send(err);
      } else {
        res.json(webApplications);
      }
    }));
  }

  public static getWebApplication(req: Request, res: Response) {
    const id = Types.ObjectId(req.params.id);
    WebApplication.findById(id, ((err, webApplication) => {
      if (err) {
        res.send(err);
      } else {
        res.json(webApplication);
      }
    }));
  }

  public static createWebApplication(req: Request, res: Response) {
    const webApplication = new WebApplication(req.body);
    webApplication.save((err, webApplication) => {
      if (err) {
        res.send(err);
      } else {
        res.json(webApplication);
      }
    });
  }
}
