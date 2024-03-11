/* eslint-disable node/no-unsupported-features/es-syntax */
import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer } from '../../types/offer.type.js';
import { City } from '../../types/city.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Facility } from '../../types/facility.enum.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    try {
      this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
    } catch (error: unknown) {
      console.log(`Failed to read .tsv file ${this.filename}`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, city, preview, pictures, isPremium, isFavorite, rating, housingType, roomsCount, guestsCount, price, facilities, author, commentsCount, coordinates]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city: City[city as keyof typeof City],
        preview,
        pictures: pictures.split(';'),
        isPremium: isPremium === 'true',
        isFavorite: isFavorite === 'true',
        rating: Number.parseInt(rating, 10),
        housingType: HousingType[housingType as keyof typeof HousingType],
        roomsCount: Number.parseInt(roomsCount, 10),
        guestsCount: Number.parseInt(guestsCount, 10),
        price: Number.parseInt(price, 10),
        facilities: facilities.split(';').map((facility) => (Facility[facility as keyof typeof Facility])),
        author,
        commentsCount: Number.parseInt(commentsCount, 10),
        coordinates
      }));
  }

}
