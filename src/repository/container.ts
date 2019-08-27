import { UserRepository } from './user';
import { ClientRepository } from './client';

import { modelContainer } from './../model/container';
import { UserDocument } from '../model/user';
import { Model } from 'mongoose';
import { ClientDocument } from '../model/client';

const userRepository = new UserRepository(
    modelContainer.get('user') as Model<UserDocument>
);

const clientRepository = new ClientRepository(
  modelContainer.get('client') as Model<ClientDocument>
);

export const repositoryContainer = {
  userRepository,
  clientRepository,
};

