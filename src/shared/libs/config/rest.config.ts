import { config } from 'dotenv';
import type { Logger } from '../../logger';
import type { Config } from './config.interface';
import { configRestSchema, type RestSchema } from './rest.schema';

export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(private readonly logger: Logger) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configRestSchema.load({});

    try {
      configRestSchema.validate({ allowed: 'strict', output: this.logger.info });
    } catch(error) {
      this.logger.error('Schema does not pass validation', error as Error);
    }

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
