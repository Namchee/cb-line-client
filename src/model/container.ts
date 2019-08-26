import { Client } from './client';
import { User } from './user';
import { Model, Document } from 'mongoose';

const modelContainer = new Map<string, Model<Document> >();

modelContainer.set('client', Client);
modelContainer.set('user', User);

export { modelContainer };
