import express, { type Express } from 'express';
import { inject, injectable } from 'inversify';
import type { Config } from '../shared/libs/config/config.interface.js';
import type { RestSchema } from '../shared/libs/config/rest.schema.js';
import type { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import type { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { getMongoURI } from '../shared/helpers/database.js';
import type { UserController } from '../shared/modules/user/user.controller.js';
import type { OfferController } from '../shared/modules/offer/offer.controller.js';
import type { ExceptionFilter } from '../shared/libs/rest/index.js';
import type { CommentController } from '../shared/modules/comment/comment.controller.js';
import type { AuthExceptionFilter } from '../shared/modules/auth/auth.exception-filter.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/middleware/parse-token.middleware.js';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.UserController) private readonly userController: UserController,
    @inject(Component.OfferController) private readonly offerController: OfferController,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
    @inject(Component.CommentController) private readonly commentController: CommentController,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: AuthExceptionFilter
  ) {
    this.server = express();
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initControllers() {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/offers', this.commentController.router);
  }

  private async _initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));

    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
  }

  private async _initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Initializing database');
    await this._initDb();
    this.logger.info('Initialization of database completed');

    this.logger.info('Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    await this._initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization compleated');

    this.logger.info('Trying to initialize server');
    await this._initServer();
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
