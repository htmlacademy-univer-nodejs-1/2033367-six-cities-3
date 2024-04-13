import { getModelForClass, prop } from '@typegoose/typegoose';
import type { User, UserType } from '../../../types/index.js';

export class UserEntity implements User {
  @prop({ required: true, minlength: [1, 'Min length for name is 1'], maxlength: [15, 'Max length for name is 15'] })
  public name = '';

  @prop({ required: true, unique: true, match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/, 'Email is incorrect'] })
  public email = '';

  @prop({ required: false, default: '', match: [/^(?i:^.*\.(png|jpg)$)/, 'Avatar file extension is incorrect'] })
  public avatar = '';

  @prop({ required: true, minlength: [6, 'Min length for password is 6'], maxlength: [12, 'Max length for password is 12'] })
  public password = '';

  @prop({ required: true })
  public userType: UserType;
}

export const UserModel = getModelForClass(UserEntity);
