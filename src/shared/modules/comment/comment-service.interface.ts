import type { DocumentType } from '@typegoose/typegoose';
import type { CreateCommentDTO } from './dto/create-comment.dto';
import type { CommentEntity } from './comment.entity';

export interface CommentService {
  create(dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
