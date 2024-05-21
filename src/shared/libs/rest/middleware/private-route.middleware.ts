import type { Request, Response, NextFunction } from 'express';
import type { Middleware } from './middleware.interface';
import { HttpError } from '../errors';
import { StatusCodes } from 'http-status-codes';

export class PrivateRouteMiddleware implements Middleware {

  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (! tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    next();
  }

}
