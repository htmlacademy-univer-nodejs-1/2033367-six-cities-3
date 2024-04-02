import type { Config } from './config.interface';

export class RestConfig implements Config {
  constructor(private readonly config: NodeJS.ProcessEnv) {}

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
