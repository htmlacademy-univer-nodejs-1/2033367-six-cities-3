import got from 'got';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.js';
import type { Command } from './commands.interface.js';
import { TSVFileWriter } from '../../shared/libs/tsv-file-writer/tsv-file-writer.js';
import { getErrorMessage } from '../../shared/helpers/common.js';
import type { MockServerData } from '../../shared/types/mock-server-data.type.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);
    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...params: string[]) {
    const [count, filepath, url] = params;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was created`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');

      console.error(getErrorMessage(error));
    }
  }
}
