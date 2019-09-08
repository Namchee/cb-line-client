import { Schema, Document } from 'mongoose';
import { connection } from '../database/connection';

export interface User {
  readonly user_id: string;
  readonly npm: string;
}

export interface UserDocument extends Document {
  user_id: string;
  npm: string;
}

const schema = new Schema({
  user_id: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },

  npm: {
    type: String,
    required: true,
    unique: true,
  },
});

export const User = connection.model<UserDocument>('LineUser', schema);
