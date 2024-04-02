import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { type Command } from './commands.interface.js';
import { createOffer } from '../../shared/helpers/index.js';
import chalk from 'chalk';

export class ImportCommand implements Command {

  public getName(): string {
    return '--import';
  }

  public async execute(...params: string[]) {
    const [filename] = params;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${error.message}`));
    }
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported`);
  }

}
