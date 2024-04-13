import type { DocumentType, types } from '@typegoose/typegoose';
import type { CreateUserDTO } from './dto/create-user.dto';
import type { UserService } from './user-service.interface';
import { UserEntity, UserModel } from './user.entity';
import { inject } from 'inversify';
import { Component } from '../../../types';
import type { Logger } from 'pino';

export class DefaultUserService implements UserService {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    throw new Error('Method not implemented.');
  }

  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    throw new Error('Method not implemented.');
  }
}
