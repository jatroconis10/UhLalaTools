import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { RandomTest, WebApplication, RandomTestUtils } from '../models';
import { throwError } from './utils';

export class RandomTestsController {
  static getRandomTests(req: Request, res: Response, next: NextFunction) {
    RandomTest.find(req.query, ((err, randomTests) => {
      if (err) next(err);
      res.json(randomTests);
    }));
  }

  static getRandomTest(req: Request, res: Response, next: NextFunction) {
    const id = Types.ObjectId(req.params.id);
    RandomTest.findById(id, ((err, randomTest) => {
      if (err) next(err);
      if (!randomTest) {
        const error: any = new Error('Random test not found');
        error.httpStatusCode = 404;
        next(error);
      }
      res.json(randomTest);
    }));
  }

  static getRandomTestByWebApplication(req: Request, res: Response, next: NextFunction) {
    const webApplicationId = Types.ObjectId(req.params.webApplication);
    RandomTest.findOne({ webApplication: webApplicationId }, (err, randomTest) => {
      if (err) next(err);
      res.json(randomTest);
    });
  }

  static createRandomTest(req: Request, res: Response, next: NextFunction) {
    const randomTest = new RandomTest(RandomTestsController.sanitizedRandomTestParams(req.body));
    randomTest.save((err, randomTest) => {
      if (err) next(err);
      res.json(randomTest);
    });
  }

  private static sanitizedRandomTestParams(randomTestParams: any) {
    if (randomTestParams.timeToLive && randomTestParams.timeToLive > 50000) {
      throwError(400, 'Maximum time to live is 50000');
    } else if (randomTestParams.numRuns && randomTestParams.numRuns > 10) {
      throwError(400, 'Maximum number of runs is 10');
    } else if (randomTestParams.numRuns && randomTestParams.numRuns > 500) {
      throwError(400, 'Maximum number of runs is 500');
    }
    return {
      webApplication: randomTestParams.webApplication,
      timeToLive: randomTestParams.timeToLive,
      seed: randomTestParams.seed,
      numRuns: randomTestParams.numRuns,
      numGremlins: randomTestParams.numGremlins,
    };
  }

  static generateRandomTestScript(req: Request, res: Response, next: NextFunction) {
    const id = Types.ObjectId(req.params.id);
    RandomTest.findById(id, ((err, randomTest) => {
      if (err) next(err);
      if (!randomTest) {
        const error: any = new Error('Random test not found');
        error.httpStatusCode = 404;
        next(error);
      }
      WebApplication.findById(randomTest.webApplication, (err, webApplication) => {
        if (err) next(err);
        RandomTestUtils.generateRandomTestScript(webApplication, randomTest);
        randomTest.generated = true;
        randomTest.save().then(() => {
          res.json({ message: 'Random test generated' });
        });
      });
    }));
  }

  static executeRandomTest(req: Request, res: Response, next: NextFunction) {
    const id = Types.ObjectId(req.params.id);
    RandomTest.findById(id, (err, randomTest) => {
      if (err) next(err);
      RandomTestUtils.executeRandomTest(randomTest);
      res.json({ message: 'Random test execution queued' });
    });
  }
}
