import { inject } from 'inversify';
import type { OfferService } from './offer-service.interface.js';
import { Component } from '../../../types/index.js';
import { OfferEntity } from './offer.entity.js';
import type { DocumentType, types } from '@typegoose/typegoose';
import type { CreateOfferDTO } from './dto/create-offer.dto.js';
import type { Logger } from '../../../logger/logger.interface.js';

export class DefaultOfferService implements OfferService {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title} (${result._id})`);

    return result;
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({id});
  }

  public async findByTitle(title: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({title});
  }

  public async findOrCreate(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const existedOffer = await this.findByTitle(dto.title);

    if (existedOffer) {
      return existedOffer;
    }

    return this.create(dto);
  }

}
