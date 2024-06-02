import type { Request, Response, NextFunction } from 'express';
import { plainToInstance, type ClassConstructor } from 'class-transformer';
import type { Middleware } from './middleware.interface';
import { validate } from 'class-validator';
import { ValidationError } from '../errors';
import { reduceValidationError } from '../../../helpers';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute({ body, path }: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: ${path}`, reduceValidationError(errors));
    }

    next();
  }
}
