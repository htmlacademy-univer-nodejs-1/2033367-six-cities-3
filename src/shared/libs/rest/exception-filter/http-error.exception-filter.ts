import { inject, injectable } from 'inversify';
import type { ExceptionFilter } from './exception-filter.interface';
import type { Logger } from '../../logger';
import { Component } from '../../../types';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';
import { createErrorObject } from '../../../helpers';
import { ApplicationError } from '../types/application-error.enum';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.warn(`[HttpErrorException]: ${req.path} # ${error.message}`, error);

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
