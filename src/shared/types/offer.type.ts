/* eslint-disable node/no-unsupported-features/es-syntax */
import { City } from './city.enum.js';
import { Facility } from './facility.enum.js';
import { HousingType } from './housing-type.enum.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  preview: string;
  pictures: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  facilities: Facility[];
  author: string;
  commentsCount: number;
  coordinates: string;
}
