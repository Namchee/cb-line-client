import { Schema, Document } from 'mongoose';
import { connection } from './../database/connection';

export interface Client {
  readonly client_id: string;
}

export interface ClientDocument extends Document {
  client_id: string;
}

const schema = new Schema({
  client_id: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
});

export const Client = connection.model<ClientDocument>('Client', schema);
