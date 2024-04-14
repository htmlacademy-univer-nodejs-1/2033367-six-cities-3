import { inject, injectable } from 'inversify';
import type { OfferService } from './offer-service.interface.js';
import { Component } from '../../../types/index.js';
import { OfferEntity } from './offer.entity.js';
import type { DocumentType, types } from '@typegoose/typegoose';
import type { CreateOfferDTO } from './dto/create-offer.dto.js';
import type { Logger } from '../../../logger/logger.interface.js';
import type { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT } from './offer.constant.js';

@injectable()
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
    return this.offerModel
      .findById(id)
      .populate(['authorId'])
      .exec();
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

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find();
  }

  public async deleteById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(id).exec();
  }

  public async updateById(id: string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('authorId')
      .exec();
  }

  public async incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, {'$inc': {
        commentsCount: 1,
      }}, { new: true });
  }

  public async findByCityAndPremium(city: string, isPremium: boolean, count?: number, offset?: number): Promise<DocumentType<OfferEntity>[] | null> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    const skip = offset ?? 0;
    return this.offerModel
      .find({city: city, isPremium: isPremium}, {}, {limit, skip})
      .populate('authorId')
      .exec();
  }

  public async findByFavorite(isFavorite: boolean, count?: number, offset?: number): Promise<DocumentType<OfferEntity>[] | null> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    const skip = offset ?? 0;
    return this.offerModel
      .find({isFavorite: isFavorite}, {}, {limit, skip})
      .populate('authorId')
      .exec();
  }

  public async addToFavorite(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, {isFavorite: false}, {new: true})
      .exec();
  }

  public async removeFromFavorite(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, {isFavorite: true}, {new: true})
      .exec();
  }

  public async exists(id: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: id})) !== null;
  }

  public async updateOfferRating(id: string): Promise<DocumentType<OfferEntity | null> | null> {
    const rating = await this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            pipeline: [
              {$match: {offerId: id}}, {$project: {rating: 1}},
              {$group: {_id: null, avg: {'$avg': '$rating'}}}
            ], as: 'avg'
          },
        },
      ]).exec();

    return this.offerModel
      .findByIdAndUpdate(id, {rating: rating[0]}, {new: true})
      .populate('authorId')
      .exec();
  }

}
