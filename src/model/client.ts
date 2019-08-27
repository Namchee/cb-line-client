import { Schema, Document, model } from 'mongoose';

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

export const Client = model<ClientDocument>('Client', schema);
