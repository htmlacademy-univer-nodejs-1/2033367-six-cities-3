import { Container } from 'inversify';
import type { AuthService } from './auth-service.interface';
import { Component } from '../../types';
import { AuthExceptionFilter } from './auth.exception-filter';
import { DefaultAuthService } from './default-auth.service';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<AuthExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return authContainer;
}
