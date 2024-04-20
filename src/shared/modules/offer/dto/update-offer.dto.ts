import type { City, Coordinates, Facility, HousingType } from '../../../../types/index.js';

export class UpdateOfferDTO {
  public title?: string;
  public description?: string;
  public postDate?: Date;
  public city?: City;
  public preview?: string;
  public pictures?: string[];
  public isPremium?: boolean;
  public housingType?: HousingType;
  public roomsCount?: number;
  public guestsCount?: number;
  public price?: number;
  public facilities?: Facility[];
  public coordinates?: Coordinates;
}
