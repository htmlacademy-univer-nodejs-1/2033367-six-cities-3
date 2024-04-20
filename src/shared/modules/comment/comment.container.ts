import { Container } from 'inversify';
import type { CommentService } from './comment-service.interface';
import { Component } from '../../../types';
import { DefaultCommentService } from './default-comment.service';
import type { types } from '@typegoose/typegoose';
import { CommentModel, type CommentEntity } from './comment.entity';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return commentContainer;
}
