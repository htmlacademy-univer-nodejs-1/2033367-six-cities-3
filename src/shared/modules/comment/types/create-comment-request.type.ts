import { type Request } from 'express';
import type { RequestBody, RequestParams } from '../../../libs/rest';
import type { CreateCommentDTO } from '../dto/create-comment.dto';

export type CreateCommentRequest = Request<RequestParams, RequestBody, CreateCommentDTO>;
