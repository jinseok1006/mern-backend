import { NextFunction, Request, Response } from 'express';
import AccessLogModel, { IAccessLog } from './models/accessLog';

const excludedUrl = [/^\/access-log/, /^\/favicon.ico/];

export default async function accessLog(req: Request, res: Response, next: NextFunction) {
  const accessLog: IAccessLog = {
    method: req.method,
    ipAddress: req.ip,
    path: req.originalUrl,
    timestamp: new Date(),
  };

  try {
    if (excludedUrl.some((url) => req.originalUrl.match(url))) return next();

    await AccessLogModel.create(accessLog);
    next();
  } catch (err) {
    next(err);
  }
}
