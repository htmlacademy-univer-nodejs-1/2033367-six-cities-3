import { Container } from 'inversify';
import type { UserService } from './user-service.interface';
import { Component } from '../../../types';
import { DefaultUserService } from './default-user.service';

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();

  return userContainer;
}
