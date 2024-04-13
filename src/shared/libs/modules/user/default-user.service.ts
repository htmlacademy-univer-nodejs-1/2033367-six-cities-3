import type { DocumentType } from '@typegoose/typegoose';
import type { CreateUserDTO } from './dto/create-user.dto';
import type { UserService } from './user-service.interface';
import { UserEntity, UserModel } from './user.entity';

export class DefaultUserService implements UserService {
  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    return UserModel.create(user);
  }

  findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    throw new Error('Method not implemented.');
  }

  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    throw new Error('Method not implemented.');
  }
}
