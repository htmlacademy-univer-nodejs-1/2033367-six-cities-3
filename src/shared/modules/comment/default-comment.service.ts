import { inject, injectable } from 'inversify';
import type { CommentService } from './comment-service.interface';
import type { DocumentType, types } from '@typegoose/typegoose';
import type { CommentEntity } from './comment.entity';
import type { CreateCommentDTO } from './dto/create-comment.dto';
import { Component } from '../../../types';
import { DEFAULT_COMMENT_COUNT } from './comment.constant';

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
