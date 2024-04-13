import type { DocumentType } from '@typegoose/typegoose';
import type { CreateOfferDTO } from './dto/create-offer.dto.js';
import type { OfferEntity } from './offer.entity.js';

export interface OfferService {
  create(dto: CreateOfferDTO, salt: string): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  findOrCreate(dto: OfferEntity, salt: string): Promise<DocumentType<OfferEntity>>
}
