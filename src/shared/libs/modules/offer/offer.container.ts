import { Container } from 'inversify';
import { Component } from '../../../types/index.js';
import type { OfferService } from './offer-service.interface.js';
import { DefaultOfferService } from './default-offer.service.js';
import type { types } from '@typegoose/typegoose';
import { OfferModel, type OfferEntity } from './offer.entity.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

  return offerContainer;
}
