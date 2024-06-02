import { inject, injectable } from 'inversify';
import type { ExceptionFilter } from './exception-filter.interface';
import { Component } from '../../../types';
import type { Logger } from '../../logger';
import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../errors';
import { createErrorObject } from '../../../helpers';
import { ApplicationError } from '../types/application-error.enum';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (! (error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationExceprtion]: ${error.message}`, error);

    error.details.forEach(
      (errorField) => this.logger.warn(`[${errorField.property}] – ${errorField.messages}`)
    );

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.ValidationError, error.message, error.details));
  }
}
