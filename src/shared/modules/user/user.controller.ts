import { inject } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract';
import { Component } from '../../types';
import type { Logger } from '../../libs/logger';
import { HttpMethod } from '../../libs/rest';
import type { Response } from 'express';
import type { CreateUserRequest } from './create-user-request.type';
import type { UserService } from './user-service.interface';
import type { Config } from 'convict';
import type { RestSchema } from '../../libs/config';

export class UserController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register router for UserController');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new Error(`User with email ${body.email} already exists.`);
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, result);
  }

}
