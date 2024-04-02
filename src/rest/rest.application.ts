import type { Config } from '../shared/libs/config/config.interface.js';
import type { Logger } from '../shared/logger/index.js';

export class RestApplication {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config<>
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
