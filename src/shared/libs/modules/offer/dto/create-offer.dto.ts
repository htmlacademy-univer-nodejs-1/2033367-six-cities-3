import type { Ref } from '@typegoose/typegoose';
import type { City, Coordinates, Facility, HousingType } from '../../../../types/index.js';
import type { UserEntity } from '../../user/user.entity.js';

export class CreateOfferDTO {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: City;
  public preview: string;
  public pictures: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public housingType: HousingType;
  public roomsCount: number;
  public guestsCount: number;
  public price: number;
  public facilities: Facility[];
  public userId: Ref<UserEntity>;
  public coordinates: Coordinates;
}
