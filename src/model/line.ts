import { Schema, Document, model } from 'mongoose';

export interface LineUser extends Document {
  line_id: string;
  npm: string;
}

const schema = new Schema({
  line_id: {
    type: String,
    required: true,
  },

  npm: {
    type: String,
    required: true,
  },
});

export const LineUser = model<LineUser>('LineUser', schema);
