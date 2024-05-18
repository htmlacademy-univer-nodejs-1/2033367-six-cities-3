import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsObject, Max, MaxLength, Min, MinLength } from 'class-validator';
import { City, Facility, HousingType, type Coordinates } from '../../../types/index.js';
import { UpdateOfferValidationMessage } from './update-offer.messages.js';

export class UpdateOfferDTO {

  @MinLength(10, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: UpdateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20)
  @MaxLength(1024)
  public description: string;

  @IsDateString({}, { message: UpdateOfferValidationMessage.postDate.invalidFormat })
  public postDate: Date;

  @IsEnum(City, { message: UpdateOfferValidationMessage.city.invalid })
  public city: City;

  @MaxLength(256, { message: UpdateOfferValidationMessage.preview.maxLength })
  public preview: string;

  @IsArray({ message: UpdateOfferValidationMessage.picutres.invalidFormat })
  public pictures: string[];

  @IsBoolean({ message: UpdateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(HousingType, { message: UpdateOfferValidationMessage.housingType.invalid })
  public housingType: HousingType;

  @IsInt({ message: UpdateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: UpdateOfferValidationMessage.roomsCount.maxValue })
  public roomsCount: number;

  @IsInt({ message: UpdateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: UpdateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount: number;

  @IsInt({ message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(100000, { message: UpdateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: UpdateOfferValidationMessage.facilities.invalidFormat })
  @IsEnum(Facility, { each: true, message: UpdateOfferValidationMessage.facilities.invalid })
  public facilities: Facility[];

  @IsObject({ message: UpdateOfferValidationMessage.coordinates.invalid })
  public coordinates: Coordinates;

}
