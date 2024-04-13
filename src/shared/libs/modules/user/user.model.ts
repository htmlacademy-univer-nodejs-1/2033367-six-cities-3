import { model, Schema } from 'mongoose';
import { type User } from '../../../types';

export interface UserDocument extends User, Document {}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [1, 'Min length for name is 1'],
    maxlength: [15, 'Max length for name is 15']
  },
  email: {
    type: String,
    unique: true,
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/, 'Email is incorrect'],
    required: true,
  },
  avatarPath: {
    type: String,
    match: [/^(?i:^.*\.(png|jpg)$)/, 'Avatar file extension is incorrect']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Min length for password is 6'],
    maxlength: [12, 'Max length for password is 12']
  },
  type: {
    type: String,
    required: true,
    match: [/^(pro|обычный)$/, 'User type must be "обычный" or "pro"'],
  }
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', userSchema);
