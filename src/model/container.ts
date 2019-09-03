import { TYPES } from '../types/symbol';

import { Client } from './client';
import { User } from './user';
import { Model, Document } from 'mongoose';

const modelContainer = new Map<symbol, Model<Document> >();

modelContainer.set(TYPES.clientModel, Client);
modelContainer.set(TYPES.userModel, User);

export { modelContainer };
