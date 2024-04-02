import { Container } from 'inversify';
import { RestApplication } from './rest';
import { PinoLogger, type Logger } from './shared/logger';
import { Component } from './shared/types';
import { type Config, RestConfig, type RestSchema } from './shared/libs/config/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication);
  container.bind<Logger>(Component.Logger).to(PinoLogger);
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig);

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
