import { Container } from 'inversify';
import type { UserService } from './user-service.interface';
import { Component } from '../../../types';
import { DefaultUserService } from './default-user.service';
import { UserModel, type UserEntity } from './user.entity';
import type { types } from '@typegoose/typegoose';

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

  return userContainer;
}
