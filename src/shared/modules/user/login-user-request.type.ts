import { type Request } from 'express';
import type { RequestBody, RequestParams } from '../../libs/rest/index.ts';
import type { LoginUserDTO } from './dto/login-user.dto.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDTO>;
