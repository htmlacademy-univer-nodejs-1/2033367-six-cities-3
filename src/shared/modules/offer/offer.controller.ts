import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/index.js';
import type { Logger } from '../../libs/logger/index.js';
import { HttpError, HttpMethod, type RequestBody, type RequestParams } from '../../libs/rest/index.js';
import type { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRDO } from './rdo/offer.rdo.js';
import type { CreateOfferRequest } from './type/create-offer-request.type.js';
import { StatusCodes } from 'http-status-codes';
import type { UpdateOfferDTO } from './dto/update-offer.dto.js';

export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register router for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.getOffer });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.deleteOffer });
    this.addRoute({ path: '/:id', method: HttpMethod.Patch, handler: this.patchOffer });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites });
    this.addRoute({ path: '/favorites/:id', method: HttpMethod.Post, handler: this.addFavorite });
    this.addRoute({ path: '/favorites/:id', method: HttpMethod.Delete, handler: this.removeFavorite });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const responseData = fillDTO(OfferRDO, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRDO, result));
  }

  public async getOffer(req: Request, res: Response): Promise<void> {
    const id = req.params['id'];
    const offer = await this.offerService.findById(id);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        'OfferController',
      );
    }

    const responseData = fillDTO(OfferRDO, offer);
    this.ok(res, responseData);
  }

  public async deleteOffer(req: Request, res: Response): Promise<void> {
    const id = req.params['id'];
    const offer = await this.offerService.findById(id);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        'OfferController',
      );
    }

    await this.offerService.deleteById(id);
    this.noContent(res);
  }

  public async patchOffer(
  // { body, params }: Request<RequestParams, unknown, UpdateOfferDTO>,
  // res: Response
  ): Promise<void> {

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'OfferController'
    );

    // const id = params['id'];
    // const offer = await this.offerService.findById(id);

    // if (!offer) {
    //   throw new HttpError(
    //     StatusCodes.NOT_FOUND,
    //     `Offer with id ${id} not found.`,
    //     'OfferController',
    //   );
    // }

    // const updatedOffer = await this.offerService.updateById(id, body);
    // const responseData = fillDTO(OfferRDO, updatedOffer);
    // this.ok(res, responseData);
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const city = req.params['city'];
    const offers = await this.offerService.findByCityAndPremium(city, true);
    const responseData = fillDTO(OfferRDO, offers);
    this.ok(res, responseData);
  }

  public async getFavorites(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findByFavorite(true);
    const responseData = fillDTO(OfferRDO, offers);
    this.ok(res, responseData);
  }

  public async addFavorite(req: Request, res: Response): Promise<void> {
    const id = req.params['id'];
    const offer = await this.offerService.findById(id);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        'OfferController',
      );
    }

    const result = await this.offerService.addToFavorite(id);
    const responseData = fillDTO(OfferRDO, result);
    this.ok(res, responseData);
  }

  public async removeFavorite(req: Request, res: Response): Promise<void> {
    const id = req.params['id'];
    const offer = await this.offerService.findById(id);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        'OfferController',
      );
    }

    const result = await this.offerService.removeFromFavorite(id);
    const responseData = fillDTO(OfferRDO, result);
    this.ok(res, responseData);
  }
}
