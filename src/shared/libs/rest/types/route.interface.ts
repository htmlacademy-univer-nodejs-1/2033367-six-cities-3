import type { NextFunction, Request, Response } from 'express';
import type { HttpMethod } from './http-method.enum.js';
import type { Middleware } from '../middleware/middleware.interface.js';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}
