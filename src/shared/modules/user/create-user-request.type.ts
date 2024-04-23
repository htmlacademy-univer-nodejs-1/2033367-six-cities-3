import { type Request } from 'express';
import type { RequestBody, RequestParams } from '../../libs/rest/index.ts';
import type { CreateUserDTO } from './dto/create-user.dto';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDTO>;
