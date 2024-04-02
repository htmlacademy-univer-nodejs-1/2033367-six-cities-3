import type { Logger } from '../shared/logger/index.js';

export class RestApplication {
  constructor(private readonly logger: Logger) {}

  public async init() {
    this.logger.info('Application initialization');
  }
}
