import type { DocumentType, types } from '@typegoose/typegoose';
import type { CreateUserDTO } from './dto/create-user.dto.js';
import type { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import type { Logger } from '../../libs/logger/logger.interface.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';

@injectable()
export class DefaultUserService implements UserService {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_FILE_NAME});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({id});
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
