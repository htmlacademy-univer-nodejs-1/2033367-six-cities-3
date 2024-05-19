import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract';
import { Component } from '../../types';
import type { Logger } from '../../libs/logger';
import type { OfferService } from '../offer';
import { HttpError, HttpMethod, ValidateObjectIdMiddleware } from '../../libs/rest';
import type { CommentService } from './comment-service.interface';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers';
import { CommentRDO } from './rdo/comment.rdo';
import type { ParamOfferId } from '../offer/type/param-offerid.type';
import type { CreateCommentDTO } from './dto/create-comment.dto';

@injectable()
export class CommentController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);
    this.logger.info('Register router for CommentController');

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.createComment,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
  }

  /**
   * 2.7. Добавление комментария для предложения.
   */
  public async createComment({ params, body }: Request<ParamOfferId, unknown, CreateCommentDTO>, res: Response): Promise<void> {
    if(!await this.offerService.exists(params.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'OfferController',
      );
    }

    const comment = await this.commentService.create(body);
    await this.offerService.incCommentCount(body.offerId);
    this.created(res, fillDTO(CommentRDO, comment));
  }

}
