import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/index.js';
import type { Logger } from '../../libs/logger/index.js';
import { HttpError, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import type { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRDO } from './rdo/offer.rdo.js';
import type { CreateOfferRequest } from './type/create-offer-request.type.js';
import { StatusCodes } from 'http-status-codes';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import type { ParamOfferId } from './type/param-offerid.type.js';
import type { RequestQuery } from '../../libs/rest/types/request-query.type.js';
import type { CommentService } from '../comment/comment-service.interface.js';
import { CommentRDO } from '../comment/rdo/comment.rdo.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';

@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);
    this.logger.info('Register router for OfferController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDTO)
      ]
    });
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffers
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.addFavoriteOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.removeFavoriteOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.patchOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  /**
   * 2.4. Получение списка предложений по аренде.
   */
  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const responseData = fillDTO(OfferRDO, offers);
    this.ok(res, responseData);
  }

  /**
   * 2.5. Получение детальной информации о предложении.
   */
  public async getOffer({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    const responseData = fillDTO(OfferRDO, offer);
    this.ok(res, responseData);
  }

  /**
   * 2.1. Создание нового предложения.
   */
  public async createOffer({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, authorId: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRDO, offer));
  }

  /**
   * 2.2. Редактирование предложения.
   */
  public async patchOffer({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDTO>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferRDO, updatedOffer));
  }

  /**
   * 2.3. Удаление предложения.
   */
  public async deleteOffer({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    await this.offerService.deleteById(offerId);
    this.noContent(res);
  }

  /**
   * 2.12. Получение списка премиальных предложений для города.
   */
  public async getPremiumOffers(
    { query }: Request<unknown, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {

    if(!query.city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Please specify the city',
        'OfferController',
      );
    }

    const offers = await this.offerService.findByCityAndPremium(query.city, true);
    const responseData = fillDTO(OfferRDO, offers);
    this.ok(res, responseData);
  }

  /**
   * 2.13. Получения списка предложений, добавленных в избранное.
   */
  public async getFavoriteOffers({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findByFavorite(tokenPayload !== undefined);
    const responseData = fillDTO(OfferRDO, offers);
    this.ok(res, responseData);
  }

  /**
   * 2.14. Добавление предложения в избранное.
   */
  public async addFavoriteOffer({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const result = await this.offerService.addToFavorite(offerId);
    const responseData = fillDTO(OfferRDO, result);
    this.ok(res, responseData);
  }

  /**
   * 2.14. Удаление предложения из избранного.
   */
  public async removeFavoriteOffer({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const result = await this.offerService.removeFromFavorite(offerId);
    const responseData = fillDTO(OfferRDO, result);
    this.ok(res, responseData);
  }

  /**
   * 2.6. Получение списка комментариев для предложения.
   */
  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRDO, comments));
  }
}
