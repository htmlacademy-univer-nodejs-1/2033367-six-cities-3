import { version } from '../../../package.json';
import { readFileSync } from 'node:fs';
import { type Command } from './commands.interface.js';
import { resolve } from 'node:path';
import chalk from 'chalk';

type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements Command {

  constructor(
    private readonly filePath: string = './package.json'
  ) {}

  private readVersion(): string {
    return version;
  }

  public getName(): string {
    return '--version';
  }

  public async execute(..._params: string[]): Promise<void> {
    try {
      const vers = this.readVersion();
      console.info(chalk.greenBright(vers));
    } catch(error: unknown) {
      console.log(chalk.red(`Failed to read version from ${this.filePath}`));

      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
    }
  }

}
