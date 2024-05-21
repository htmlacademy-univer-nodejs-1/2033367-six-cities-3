import { StatusCodes } from 'http-status-codes';
import { BaseUserException } from './base-user.exception';

export class UserPasswordIncorrectException extends BaseUserException {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
  }
}
