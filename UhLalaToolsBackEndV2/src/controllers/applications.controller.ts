import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { Application, WebApplication, MobileApplication } from '../models';

export class ApplicationsController {
  public static getApplications(_: Request, res: Response, next: NextFunction) {
    Application.find({}, ((err, applications) => {
      if (err) return next(err);
      res.json(applications);
    }));
  }

  public static getApplication(req: Request, res: Response, next: NextFunction) {
    const id = Types.ObjectId(req.params.id);
    Application.findById(id, ((err, application) => {
      if (err) return next(err);
      if (!application) {
        const error: any = new Error('Application not found');
        error.httpStatusCode = 404;
        return next(error);
      }
      res.json(application);
    }));
  }

  public static getWebApplicationFromApplication(req: Request, res: Response, next: NextFunction) {
    const id = Types.ObjectId(req.params.id);
    WebApplication.findOne({ application: id }, ((err, webApplication) => {
      if (err) return next(err);
      res.json(webApplication);
    }));
  }

  public static getMobileApplicationFromApplication(req: Request, res: Response, next: NextFunction) {
    const id = Types.ObjectId(req.params.id);
    MobileApplication.findOne({ application: id }, ((err, mobileApplication) => {
      if (err) return next(err);
      res.json(mobileApplication);
    }));
  }

  public static createApplication(req: Request, res: Response, next: NextFunction) {
    const application = new Application(req.body);
    application.save((err, application) => {
      if (err) return next(err);
      res.json(application);
    });
  }
}
