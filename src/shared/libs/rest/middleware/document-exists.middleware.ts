import type { Request, Response, NextFunction } from 'express';
import type { Middleware } from './middleware.interface';
import type { DocumentExists } from '../../../types/document-exists.interface';
import { HttpError } from '../errors';
import { StatusCodes } from 'http-status-codes';

export class DocumentExistsMiddleware implements Middleware {

  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly paramName: string
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }

}
