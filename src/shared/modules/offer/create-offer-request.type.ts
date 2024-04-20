import { type Request } from 'express';
import type { RequestBody, RequestParams } from '../../libs/rest/index.ts';
import type { CreateOfferDTO } from './dto/create-offer.dto.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDTO>;
