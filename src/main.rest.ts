import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createRestApplicationContainer } from './rest/rest.container.js';

async function bootstrap() {
  const container = new Container();

  const appContainer = Container.merge(createRestApplicationContainer());

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
