import { inject, injectable } from 'inversify';
import type { ExceptionFilter } from './exception-filter.interface';
import type { Logger } from '../../logger';
import { Component } from '../../../types';
import type { NextFunction, Request, Response } from 'express';
import { createErrorObject } from '../../../helpers';
import { ApplicationError } from '../types/application-error.enum';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.warn(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
