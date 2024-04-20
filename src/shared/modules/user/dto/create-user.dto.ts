import type { UserType } from '../../../../types/index.js';

export class CreateUserDTO {
  public name: string;
  public avatar: string;
  public email: string;
  public userType: UserType;
  public password: string;
}
