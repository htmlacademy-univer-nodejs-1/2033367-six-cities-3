import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import type { User, UserType } from '../../../types/index.js';
import { createSHA256 } from '../../../helpers/hash.js';

export interface UserEntity extends defaultClasses.Base {}


@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, minlength: [1, 'Min length for name is 1'], maxlength: [15, 'Max length for name is 15'], default: '' })
  public name: string;

  @prop({ required: true, unique: true, match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/, 'Email is incorrect'], default: '' })
  public email: string;

  @prop({ required: false, default: '', match: [/^(?i:^.*\.(png|jpg)$)/, 'Avatar file extension is incorrect'] })
  public avatar: string;

  @prop({ required: true })
  public userType: UserType;

  @prop({ required: true, minlength: [6, 'Min length for password is 6'], maxlength: [12, 'Max length for password is 12'], default: '' })
  private password?: string;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.avatar = userData.avatar;
    this.email = userData.email;
    this.userType = userData.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
