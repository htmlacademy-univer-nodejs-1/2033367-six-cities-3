import { inject, injectable } from 'inversify';
import type { AuthService } from './auth-service.interface.js';
import { Component } from '../../types/component.enum.js';
import type { Logger } from '../../libs/logger/logger.interface.js';
import type { UserService } from '../user/user-service.interface.js';
import type { RestSchema } from '../../libs/config/rest.schema.js';
import type { Config } from '../../libs/config/config.interface.js';
import type { UserEntity } from '../user/user.entity.js';
import { SignJWT } from 'jose';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth-constant.js';
import type { LoginUserDTO } from '../user/index.js';
import * as crypto from 'node:crypto';
import type { TokenPayload } from './types/token-payload.type.js';
import { UserPasswordIncorrectException } from './exceptions/user-password-incorrect.exception.js';
import { UserNotFoundException } from './exceptions/user-not-found.exception.js';

@injectable()
export class DefaultAuthService implements AuthService {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`User with email ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
