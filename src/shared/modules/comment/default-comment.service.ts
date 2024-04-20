import { inject, injectable } from 'inversify';
import type { CommentService } from './comment-service.interface.js';
import type { DocumentType, types } from '@typegoose/typegoose';
import type { CommentEntity } from './comment.entity.js';
import type { CreateCommentDTO } from './dto/create-comment.dto.js';
import { Component } from '../../types/index.js';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';

@injectable()
export class DefaultCommentService implements CommentService {

  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string, count?: number, offset?: number): Promise<DocumentType<CommentEntity>[]> {
    const limit = count ?? DEFAULT_COMMENT_COUNT;
    const skip = offset ?? 0;
    return this.commentModel
      .find({offerId}, {limit, skip})
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }

}
