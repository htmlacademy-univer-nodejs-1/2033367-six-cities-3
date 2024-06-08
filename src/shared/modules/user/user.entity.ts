import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import type { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/hash.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true,
    minlength: [1, 'Min length for name is 1'],
    maxlength: [15, 'Max length for name is 15'],
    default: '',
    type: () => String
  })
  public name!: string;

  @prop({
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/, 'Email is incorrect'],
    default: '',
    type: () => String
  })
  public email!: string;

  @prop({
    required: false,
    default: '',
    type: () => String
  })
  public avatar!: string;

  @prop({
    required: true,
    type: () => String
  })
  public userType!: UserType;

  @prop({
    required: true,
    default: '',
    type: () => String
  })
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

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
