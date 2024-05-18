export const UpdateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date'
  },
  city: {
    invalid: 'City must be one of Paris, Cologne, Brussels, Amsterdam, Hamburg and Dusseldorf'
  },
  preview: {
    maxLength: 'Too long for field «preview»',
  },
  picutres: {
    invalidFormat: 'Field pictures must be an array',
    invalid: 'Pictures must be an array of valid pictures'
  },
  isPremium: {
    invalidFormat: 'Field isPremium must be a boolean',
  },
  housingType: {
    invalid: 'Field housingType must be one of apartment, house, room and hotel'
  },
  roomsCount: {
    invalidFormat: 'roomsCount must be an integer',
    minValue: 'Minimum roomsCount is 1',
    maxValue: 'Maximum roomsCount is 8'
  },
  guestsCount: {
    invalidFormat: 'guestsCount must be an integer',
    minValue: 'Minimum guestsCount is 1',
    maxValue: 'Maximum guestsCount is 10'
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000'
  },
  facilities: {
    invalidFormat: 'Field facilities must be an array',
    invalid: 'Facilities must be an array of valid facilities'
  },
  coordinates: {
    invalid: 'City must be one of Paris, Cologne, Brussels, Amsterdam, Hamburg and Dusseldorf'
  },
} as const;
