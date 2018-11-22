import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { throwError } from './utils';

import { E2ETest, WebApplication, E2ETestUtils } from '../models';

export class E2ETestsController {
  public static getE2ETests(req: Request, res: Response, next: NextFunction) {
    E2ETest.find(req.query, ((err, e2eTests) => {
      if (err) return next(err);
      res.json(e2eTests);
    }));
  }

  public static getE2ETest(req: Request, res: Response, next: NextFunction) {
    const id = Types.ObjectId(req.params.id);
    E2ETest.findById(id, ((err, e2eTest) => {
      if (err) return next(err);
      res.json(e2eTest);
    }));
  }

  public static getE2ETestScript(req: Request, res: Response, next: NextFunction) {

  }

  public static getE2ETestReport(req: Request, res: Response, next: NextFunction) {

  }

  public static generateE2ETestsScript(req: Request, res: Response, next: NextFunction) {
    const webApplicationId = Types.ObjectId(req.params.webApplicationId);
    const version = req.body.version;
    if (!version) {
      const error: any = new Error('Version not specified');
      error.httpStatusCode = 400;
      return next(error);
    }
    E2ETest.find({
      webApplication: webApplicationId
    }, (err, e2eTests) => {
      if (err) return next(err);
      if (e2eTests.length == 0) {
        const error: any = new Error('There are no E2E Tests for the web application');
        error.httpStatusCode = 404;
        return next(error);
      }
      E2ETestUtils.generateE2ETestsScripts(e2eTests, version);
      res.json({ message: 'E2E Tests scripts generated' });
    });
  }

  public static executeE2ETest(req: Request, res: Response, next: NextFunction) {

  }

  public static createE2ETest(req: Request, res: Response, next: NextFunction) {
    E2ETestsController.checkCreateE2ETestParameters(req);
    WebApplication.findById(req.body.webApplication, ((err, version) => {
      if (err) next(err);
      if (!version) throwError(404, 'Web application not found');
      const e2eTest = new E2ETest(E2ETestsController.sanitizeE2ETestParameters(req));
      e2eTest.save((err, e2eTest) => {
        if (err) next(err);
        res.json(e2eTest);
      });
    }));
  }

  private static checkCreateE2ETestParameters(req: Request) {
    const { body } = req;
    if (!body.webApplication) throwError(422, 'Web application not specified');
  }

  private static sanitizeE2ETestParameters(req: Request) {
    const { body } = req;
    return {
      webApplication: body.webApplication,
      name: body.name,
      description: body.description,
      commands: body.commands
    };
  }
}
