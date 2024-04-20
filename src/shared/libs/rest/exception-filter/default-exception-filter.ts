import type { Request, Response, NextFunction } from 'express';
import type { ExceptionFilter } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../../types/index.js';
import type { Logger } from '../../logger/index.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class DefaultExceptionFilter implements ExceptionFilter {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ) {
    this.logger.info('Register DefaultExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}
