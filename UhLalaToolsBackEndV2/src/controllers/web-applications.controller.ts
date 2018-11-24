import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { WebApplication, DEFAULT_CAPABILITIES } from '../models';

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
      if (!webApplication) {
        const error: any = new Error('Web application not found');
        error.httpStatusCode = 404;
        return next(error);
      }
      res.json(webApplication);
    }));
  }

  public static createWebApplication(req: Request, res: Response, next: NextFunction) {
    const webApplication = new WebApplication(WebApplicationsController.sanitizedWebApplicationParams(req.body));
    webApplication.save((err, webApplication) => {
      if (err) return next(err);
      res.json(webApplication);
    });
  }

  private static sanitizedWebApplicationParams(webApplicationParams: any) {
    return {
      application: webApplicationParams.application,
      url: webApplicationParams.url,
      browserCapabilities: webApplicationParams.browserCapabilities || DEFAULT_CAPABILITIES
    };
  }
}
