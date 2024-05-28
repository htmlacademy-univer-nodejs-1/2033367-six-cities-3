import type { LoginUserDTO, UserEntity } from '../user';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDTO): Promise<UserEntity>;
}
