import type { DocumentType } from '@typegoose/typegoose';
import type { CreateUserDTO } from './dto/create-user.dto';
import type { UserEntity } from './user.entity';

export interface UserService {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>
}
