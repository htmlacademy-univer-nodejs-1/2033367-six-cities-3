import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsObject, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';
import { City, Facility, HousingType, type Coordinates } from '../../../types/index.js';
import { UpdateOfferValidationMessage } from './update-offer.messages.js';

export class UpdateOfferDTO {

  @IsOptional()
  @MinLength(10, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: UpdateOfferValidationMessage.title.maxLength })
  public title: string;

  @IsOptional()
  @MinLength(20)
  @MaxLength(1024)
  public description: string;

  @IsOptional()
  @IsDateString({}, { message: UpdateOfferValidationMessage.postDate.invalidFormat })
  public postDate: Date;

  @IsOptional()
  @IsEnum(City, { message: UpdateOfferValidationMessage.city.invalid })
  public city: City;

  @IsOptional()
  @MaxLength(256, { message: UpdateOfferValidationMessage.preview.maxLength })
  public preview: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.picutres.invalidFormat })
  public pictures: string[];

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsOptional()
  @IsEnum(HousingType, { message: UpdateOfferValidationMessage.housingType.invalid })
  public housingType: HousingType;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: UpdateOfferValidationMessage.roomsCount.maxValue })
  public roomsCount: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: UpdateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(100000, { message: UpdateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.facilities.invalidFormat })
  @IsEnum(Facility, { each: true, message: UpdateOfferValidationMessage.facilities.invalid })
  public facilities: Facility[];

  @IsOptional()
  @IsObject({ message: UpdateOfferValidationMessage.coordinates.invalid })
  public coordinates: Coordinates;

}
