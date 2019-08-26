import { Schema, Document, model } from 'mongoose';

export interface UserDocument extends Document {
  user_id: string;
  npm: string;
}

export interface User {
  readonly user_id: string;
  readonly npm: string;
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

export const User = model<UserDocument>('LineUser', schema);
