import type { DocumentType } from '@typegoose/typegoose';
import type { CreateOfferDTO } from './dto/create-offer.dto.js';
import type { OfferEntity } from './offer.entity.js';
import type { UpdateOfferDTO } from './dto/update-offer.dto.js';

export interface OfferService {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(id: string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null>;
  findByCityAndPremium(city: string, isPremium: boolean): Promise<DocumentType<OfferEntity>[] | null>;
  findByFavorite(isFavorite: boolean): Promise<DocumentType<OfferEntity>[] | null>;
  addToFavorite(id: string): Promise<DocumentType<OfferEntity> | null>;
  removeFromFavorite(id: string): Promise<DocumentType<OfferEntity> | null>;
  exists(id: string): Promise<boolean>;
}
