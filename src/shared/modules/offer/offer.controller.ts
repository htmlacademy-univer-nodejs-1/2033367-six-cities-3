import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/index.js';
import type { Logger } from '../../libs/logger/index.js';
import { HttpError, HttpMethod } from '../../libs/rest/index.js';
import type { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRDO } from './rdo/offer.rdo.js';
import type { CreateOfferRequest } from './type/create-offer-request.type.js';
import { StatusCodes } from 'http-status-codes';
import type { UpdateOfferDTO } from './dto/update-offer.dto.js';
import type { ParamOfferId } from './type/param-offerid.type.js';
import type { RequestQuery } from '../../libs/rest/types/request-query.type.js';

@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register router for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.createOffer });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.getOffer });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.deleteOffer });
    this.addRoute({ path: '/:id', method: HttpMethod.Patch, handler: this.patchOffer });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremiumOffers });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavoriteOffers });
    this.addRoute({ path: '/favorites/:id', method: HttpMethod.Post, handler: this.addFavoriteOffer });
    this.addRoute({ path: '/favorites/:id', method: HttpMethod.Delete, handler: this.removeFavoriteOffer });
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

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController',
      );
    }

    const responseData = fillDTO(OfferRDO, offer);
    this.ok(res, responseData);
  }

  /**
   * 2.1. Создание нового предложения.
   */
  public async createOffer({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRDO, offer));
  }

  /**
   * 2.2. Редактирование предложения.
   */
  public async patchOffer({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDTO>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRDO, updatedOffer));
  }

  /**
   * 2.3. Удаление предложения.
   */
  public async deleteOffer({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController',
      );
    }

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
   * 2.3. Удаление предложения.
   */
  public async getFavoriteOffers(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findByFavorite(true);
    const responseData = fillDTO(OfferRDO, offers);
    this.ok(res, responseData);
  }

  /**
   * 2.14. Добавление предложения в избранное.
   */
  public async addFavoriteOffer({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController',
      );
    }

    const result = await this.offerService.addToFavorite(offerId);
    const responseData = fillDTO(OfferRDO, result);
    this.ok(res, responseData);
  }

  /**
   * 2.14. Удаление предложения из избранного.
   */
  public async removeFavoriteOffer({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController',
      );
    }

    const result = await this.offerService.removeFromFavorite(offerId);
    const responseData = fillDTO(OfferRDO, result);
    this.ok(res, responseData);
  }
}
