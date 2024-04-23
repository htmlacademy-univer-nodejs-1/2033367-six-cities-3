import { Container } from 'inversify';
import type { UserService } from './user-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultUserService } from './default-user.service.js';
import { UserModel, type UserEntity } from './user.entity.js';
import type { types } from '@typegoose/typegoose';
import type { Controller } from '../../libs/rest/index.js';
import { UserController } from './user.controller.js';

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return userContainer;
}
