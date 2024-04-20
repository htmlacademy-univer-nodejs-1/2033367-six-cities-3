import { injectable } from 'inversify';
import type { Controller } from './controller.interface.js';
import { Router, type Response } from 'express';
import type { Route } from '../types/route.interface.js';
import type { Logger } from '../../logger/index.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

const DEFAULT_CONTENT_TYPE = 'application/json';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;

  constructor(
    protected readonly logger: Logger
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route): void {
    const wrapperAsyncHandler = expressAsyncHandler(route.handler.bind(this));
    this._router[route.method](route.path, wrapperAsyncHandler);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent(res: Response): void {
    this.send(res, StatusCodes.NO_CONTENT, null);
  }

  public notFound(res: Response): void {
    this.send(res, StatusCodes.NOT_FOUND, null);
  }

  public badRequest(res: Response): void {
    this.send(res, StatusCodes.BAD_REQUEST, null);
  }
}
