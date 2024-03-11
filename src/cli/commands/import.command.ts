/* eslint-disable node/no-unsupported-features/es-syntax */
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Command } from './commands.interface.js';

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

      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${error.message}`);
    }
  }

}
