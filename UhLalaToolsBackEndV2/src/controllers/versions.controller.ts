import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { Version, WebApplication, MobileApplication, IWebApplication, IMobileApplication, IVersion } from '../models';
import { throwError } from './utils';

type ApplicationType = 'WebApplication' | 'MobileApplication';

export class VersionsController {
  public static getVersions(req: Request, res: Response, next: NextFunction) {
    Version.find(req.query, ((err, versions) => {
      if (err) return next(err);
      res.json(versions);
    }));
  }

  public static getVersion(req: Request, res: Response, next: NextFunction) {
    const id = Types.ObjectId(req.params.id);
    Version.findById(id, ((err, version) => {
      if (err) return next(err);
      res.json(version);
    }));
  }

  public static createVersion(req: Request, res: Response, next: NextFunction) {
    VersionsController.checkCreateVersionRequiredParameters(req.body);
    const { application, applicationType } = req.body;
    VersionsController.findApplication(application, applicationType).then(application => {
      if (!application) throwError(404, 'Application not found');
      VersionsController.findLastVersionOfApplication(application).then(previousLastVersion => {
        const newVersion = new Version({
          ...VersionsController.sanitizeParameters(req.body), previousVersion: previousLastVersion._id
        });
        VersionsController.checkDifferentVersion(previousLastVersion.version, newVersion.version);
        newVersion.save((err, version) => {
          if (err) return next(err);
          previousLastVersion.nextVersion = version;
          previousLastVersion.save();
          res.json(version);
        });
      }).catch(err => next(err));
    }).catch(err => next(err));
  }

  private static checkCreateVersionRequiredParameters(requestBody: any) {
    const { application, applicationType } = requestBody;
    if (!application) {
      throwError(422, 'No application specified');
    }
    if (applicationType !== 'WebApplication' && applicationType !== 'MobileApplication') {
      throwError(422, 'No valid application type specified');
    }
  }

  private static checkDifferentVersion(version1: string, version2: string) {
    if (version1 === version2) {
      throwError(422, 'Repeated version');
    }
  }

  public static findApplication(
    application: string, applicationType: ApplicationType
  ): Promise<IWebApplication> | Promise<IMobileApplication> {
    if (applicationType === 'WebApplication') {
      return WebApplication.findById(application).exec();
    } else if (applicationType === 'MobileApplication') {
      return MobileApplication.findById(application).exec();
    }
  }

  public static findLastVersionOfApplication(
    application: IWebApplication | IMobileApplication
  ): Promise<IVersion> {
    return Version.findOne({
      application: application._id,
      nextVersion: undefined
    }).exec();
  }

  private static sanitizeParameters(parameters: any): any {
    return {
      application: parameters.application,
      version: parameters.version,
      applicationType: parameters.applicationType
    };
  }
}
