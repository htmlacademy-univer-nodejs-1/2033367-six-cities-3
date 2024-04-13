import { City } from './city.enum.js';
import { Facility } from './facility.enum.js';
import { HousingType } from './housing-type.enum.js';
import { type User } from './user.type.js';
import { type Coordinates } from './coordinates.type.js';
import type { Ref } from '@typegoose/typegoose';
import type { UserEntity } from '../libs/modules/user/user.entity.js';

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
  authorId: Ref<UserEntity>;
  commentsCount: number;
  coordinates: Coordinates;
}
