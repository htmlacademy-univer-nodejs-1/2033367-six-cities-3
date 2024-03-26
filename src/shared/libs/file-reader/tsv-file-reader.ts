import { readFileSync } from 'node:fs';
import { type FileReader } from './file-reader.interface.js';
import { type Offer } from '../../types/offer.type.js';
import { City } from '../../types/city.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Facility } from '../../types/facility.enum.js';
import { UserType } from '../../types/user-type.enum.js';
import chalk from 'chalk';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    try {
      this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
    } catch (error: unknown) {
      console.log(chalk.red(`Failed to read .tsv file ${this.filename}`));

      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
    }
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    const offers: Offer[] = [];

    for (const row of this.rawData.split('\n')) {
      if (row.trim().length === 0) {
        continue;
      }

      const [
        title,
        description,
        postDate,
        city,
        preview,
        pictures,
        isPremium,
        isFavorite,
        rating,
        housingType,
        roomsCount,
        guestsCount,
        price,
        facilities,
        name,
        email,
        avatar,
        password,
        userType,
        coordinates
      ] = row.split('\t');

      const offer: Offer = {
        title,
        description,
        postDate: new Date(postDate),
        city: City[city as keyof typeof City],
        preview,
        pictures: pictures.split(';'),
        isPremium: isPremium.toLowerCase() === 'true',
        isFavorite: isFavorite.toLowerCase() === 'true',
        rating: Number.parseInt(rating, 10),
        housingType: HousingType[housingType as keyof typeof HousingType],
        roomsCount: Number.parseInt(roomsCount, 10),
        guestsCount: Number.parseInt(guestsCount, 10),
        price: Number.parseInt(price, 10),
        facilities: facilities.split(';').map((facility) => (Facility[facility as keyof typeof Facility])),
        author: {
          name,
          email,
          avatar,
          password,
          userType: userType as UserType
        },
        commentsCount: 0,
        coordinates: {
          latitude: Number.parseFloat(coordinates.split(';')[0]),
          longitude: Number.parseFloat(coordinates.split(';')[1])
        }
      };

      offers.push(offer);
    }

    return offers;
  }

}
