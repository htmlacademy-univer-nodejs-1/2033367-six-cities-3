import { type OfferGenerator } from './offer-generator.interface.js';
import {
  Facility,
  City,
  type MockServerData,
  UserType,
  HousingType,
} from '../../types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import dayjs from 'dayjs';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOM_COUNT = 1;
const MAX_ROOM_COUNT = 8;

const MIN_GUEST_COUNT = 1;
const MAX_GUEST_COUNT = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const CITIES_INFO = [
  {
    city: City.Paris,
    latitude: 48.85661,
    longitude: 2.351499,
  },
  {
    city: City.Cologne,
    latitude: 50.938361,
    longitude: 6.959974,
  },
  {
    city: City.Brussels,
    latitude: 50.846557,
    longitude: 4.351697,
  },
  {
    city: City.Amsterdam,
    latitude: 52.370216,
    longitude: 4.895168,
  },
  {
    city: City.Hamburg,
    latitude: 53.550341,
    longitude: 10.000654,
  },
  {
    city: City.Dusseldorf,
    latitude: 51.225402,
    longitude: 6.776314,
  },
];

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);

    const postDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const cityInfo = getRandomItem(CITIES_INFO);
    const preview = getRandomItem<string>(this.mockData.previews);
    const pictures = getRandomItems<string>(this.mockData.pictures).join(';');
    const isPremium = getRandomItem<string>(['true', 'false']);
    const isFavorite = getRandomItem<string>(['true', 'false']);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const housingType = getRandomItem([
      HousingType.Apartment,
      HousingType.Hotel,
      HousingType.House,
      HousingType.Room,
    ]);
    const roomsCount = generateRandomValue(
      MIN_ROOM_COUNT,
      MAX_ROOM_COUNT
    ).toString();
    const guestsCount = generateRandomValue(
      MIN_GUEST_COUNT,
      MAX_GUEST_COUNT
    ).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const facilities = getRandomItems([
      Facility.AirConditioning,
      Facility.Fridge,
      Facility.Towels,
      Facility.BabySeat,
      Facility.Washer,
      Facility.Breakfast,
      Facility.LaptopFriendlyWorkspace,
    ]).join(';');
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const password = getRandomItem<string>(this.mockData.passwords);
    const userType = getRandomItem([UserType.Common, UserType.Pro]);

    const { city, latitude, longitude } = cityInfo;
    const coordinates = `${latitude};${longitude}`;

    return [
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
    ].join('\t');
  }
}
