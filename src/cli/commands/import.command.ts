import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { type Command } from './commands.interface.js';
import { createOffer, getMongoURI } from '../../shared/helpers/index.js';
import chalk from 'chalk';
import type { UserService } from '../../shared/libs/modules/user/user-service.interface.js';
import type { OfferService } from '../../shared/libs/modules/offer/offer-service.interface.js';
import type { DatabaseClient } from '../../shared/libs/database-client/database-client.interface.js';
import type { Logger } from '../../shared/logger/logger.interface.js';
import { DefaultOfferService } from '../../shared/libs/modules/offer/default-offer.service.js';
import { DefaultUserService } from '../../shared/libs/modules/user/default-user.service.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import type { Offer } from '../../shared/types/offer.type.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { OfferModel } from '../../shared/libs/modules/offer/offer.entity.js';
import { UserModel } from '../../shared/libs/modules/user/user.entity.js';
import { PinoLogger } from '../../shared/logger/pino.logger.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new PinoLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string,
    host: string, dbname: string, salt: string): Promise<void> {

    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.logger.info(uri);
    this.salt = salt;

    await this.databaseClient.connect(uri);

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

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      preview: offer.preview,
      pictures: offer.pictures,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      housingType: offer.housingType,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      price: offer.price,
      facilities: [...offer.facilities],
      authorId: user.id,
      coordinates: offer.coordinates
    });
  }
}
