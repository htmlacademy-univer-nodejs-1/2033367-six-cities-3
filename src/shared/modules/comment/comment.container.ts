import { Container } from 'inversify';
import type { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultCommentService } from './default-comment.service.js';
import type { types } from '@typegoose/typegoose';
import { CommentModel, type CommentEntity } from './comment.entity.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return commentContainer;
}
