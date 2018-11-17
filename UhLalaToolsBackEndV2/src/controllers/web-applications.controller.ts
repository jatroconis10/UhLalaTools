import { Request, Response } from 'express';

import { WebApplication } from '../models';

export class WebApplicationsController {
  public static getWebApplications(_: Request, res: Response) {
    res.json({
      message: 'get web applications'
    });
  }

  public static getWebApplication(_: Request, res: Response) {
    res.json({
      message: 'get web application'
    });
  }

  public static createWebApplication(req: Request, res: Response) {
    const webApplication = new WebApplication(req.body);
    webApplication.save((err, webApplication) => {
      if (err) {
        res.send(err);
      }
      res.json(webApplication);
    });
  }
}
