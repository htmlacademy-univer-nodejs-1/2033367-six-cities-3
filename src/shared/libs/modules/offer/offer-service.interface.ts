import type { DocumentType } from '@typegoose/typegoose';
import type { CreateOfferDTO } from './dto/create-offer.dto.js';
import type { OfferEntity } from './offer.entity.js';

export interface OfferService {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  findByTitle(title: string): Promise<DocumentType<OfferEntity> | null>;
  findOrCreate(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  find(): Promise<DocumentType<OfferEntity>[]>;
}
