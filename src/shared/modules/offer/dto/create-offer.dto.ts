import { City, Facility, HousingType, type Coordinates } from '../../../../shared/types/index.js';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsObject, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferDTO {

  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20)
  @MaxLength(1024)
  public description: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.postDate.invalidFormat })
  public postDate: Date;

  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalid })
  public city: City;

  @MaxLength(256, { message: CreateOfferValidationMessage.preview.maxLength })
  public preview: string;

  @IsArray({ message: CreateOfferValidationMessage.picutres.invalidFormat })
  public pictures: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsBoolean({ message: CreateOfferValidationMessage.isFavorite.invalidFormat })
  public isFavorite: boolean;

  @IsInt({ message: CreateOfferValidationMessage.rating.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.rating.minValue })
  @Max(5, { message: CreateOfferValidationMessage.rating.maxValue })
  public rating: number;

  @IsEnum(HousingType, { message: CreateOfferValidationMessage.housingType.invalid })
  public housingType: HousingType;

  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomsCount.maxValue })
  public roomsCount: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.facilities.invalidFormat })
  @IsEnum(Facility, { each: true, message: CreateOfferValidationMessage.facilities.invalid })
  public facilities: Facility[];

  public authorId: string;

  @IsObject({ message: CreateOfferValidationMessage.coordinates.invalid })
  public coordinates: Coordinates;

}
