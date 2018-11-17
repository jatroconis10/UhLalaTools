import { Request, Response } from 'express';
import { Application } from '../models';
import { Types } from 'mongoose';

export class ApplicationsController {
  public static getApplications(_: Request, res: Response) {
    Application.find({}, ((err, applications) => {
      if (err) {
        res.send(err);
      }
      res.json(applications);
    }));
  }

  public static getApplication(req: Request, res: Response) {
    const id = Types.ObjectId(req.params.id);
    Application.findById(id, ((err, application) => {
      if (err) {
        res.send(err);
      } else {
        res.json(application);
      }
    }));
  }

  public static createApplication(req: Request, res: Response) {
    const application = new Application(req.body);
    application.save((err, application) => {
      if (err) {
        res.send(err);
      } else {
        res.json(application);
      }
    });
  }
}
