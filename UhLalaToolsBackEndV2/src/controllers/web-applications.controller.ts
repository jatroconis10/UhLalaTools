import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { WebApplication, Version } from '../models';

export class WebApplicationsController {
  public static getWebApplications(req: Request, res: Response, next: NextFunction) {
    WebApplication.find(req.query, ((err, webApplications) => {
      if (err) return next(err);
      res.json(webApplications);
    }));
  }

  public static getWebApplication(req: Request, res: Response, next: NextFunction) {
    const id = Types.ObjectId(req.params.id);
    WebApplication.findById(id, ((err, webApplication) => {
      if (err) return next(err);
      res.json(webApplication);
    }));
  }

  public static createWebApplication(req: Request, res: Response, next: NextFunction) {
    const webApplication = new WebApplication(req.body);
    webApplication.save((err, webApplication) => {
      if (err) return next(err);
      new Version({
        version: req.body.version,
        application: webApplication._id,
        applicationType: 'WebApplication'
      }).save((err, _) => {
        if (err) return next(err);
        res.json(webApplication);
      });
    });
  }
}
