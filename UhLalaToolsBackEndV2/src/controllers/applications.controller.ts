import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { Application } from '../models';

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
      res.json(application);
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
