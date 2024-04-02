import { type DotenvParseOutput, config } from 'dotenv';
import type { Logger } from '../../logger';
import type { Config } from './config.interface';

export class RestConfig implements Config {
  private readonly config: NodeJS.ProcessEnv;

  constructor(private readonly logger: Logger) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info('.env file found and successfully parsed!');
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
