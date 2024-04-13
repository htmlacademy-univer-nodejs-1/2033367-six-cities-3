import { City, Facility, HousingType, UserType, type Offer } from '../types/index.js';

export function createOffer(offerData: string): Offer {
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
    userType,
    coordinates
  ] = offerData.replace('\n', '').split('\t');

  return {
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
      userType: userType as UserType
    },
    commentsCount: 0,
    coordinates: {
      latitude: Number.parseFloat(coordinates.split(';')[0]),
      longitude: Number.parseFloat(coordinates.split(';')[1])
    }
  };
}
