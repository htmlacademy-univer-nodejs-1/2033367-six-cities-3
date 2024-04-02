import { RestApplication } from './rest';
import { PinoLogger } from './shared/logger';

async function bootstrap() {
  const logger = new PinoLogger();

  const application = new RestApplication(logger);
  await application.init();
}

bootstrap();
