import { model, Schema } from 'mongoose';
import { type User } from '../../../types';

export interface UserDocument extends User, Document {}

const userSchema = new Schema({
  name: String,
  email: String,
  avatarPath: String,
  password: String,
  type: String
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', userSchema);
