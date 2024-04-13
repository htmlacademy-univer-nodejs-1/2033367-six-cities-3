import { Container } from 'inversify';
import { RestApplication } from './rest.application.js';
import { type Config, RestConfig, type RestSchema } from '../shared/libs/config/index.js';
import { MongoDatabaseClient, type DatabaseClient } from '../shared/libs/database-client/index.js';
import { Component } from '../shared/types/index.js';
import { PinoLogger, type Logger } from '../shared/logger/index.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  return restApplicationContainer;
}
