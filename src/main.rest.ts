import { RestApplication } from './rest';
import { RestConfig } from './shared/libs/config';
import { PinoLogger } from './shared/logger';

async function bootstrap() {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);

  const application = new RestApplication(logger, config);
  await application.init();
}

bootstrap();
