import type { User, UserType } from '../../../types/index.js';

export class UserEntity implements User {
  public name = '';
  public email = '';
  public avatar = '';
  public password = '';
  public userType: UserType;
}
