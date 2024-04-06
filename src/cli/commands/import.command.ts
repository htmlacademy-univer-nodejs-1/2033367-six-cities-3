import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { type Command } from './commands.interface.js';
import chalk from 'chalk';

export class ImportCommand implements Command {

  public getName(): string {
    return '--import';
  }

  public execute(...params: string[]): void {
    const [filename] = params;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${error.message}`));
    }
  }

}
