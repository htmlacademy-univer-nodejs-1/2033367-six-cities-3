import { inject, injectable } from 'inversify';
import type { CommentService } from './comment-service.interface';
import type { DocumentType, types } from '@typegoose/typegoose';
import type { CommentEntity } from './comment.entity';
import type { CreateCommentDTO } from './dto/create-comment.dto';
import { Component } from '../../../types';

@injectable()
export class DefaultCommentService implements CommentService {

  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }

}
