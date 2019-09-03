import { TYPES } from '../types/symbol';
import { Repository } from './base';

import { UserRepository } from './db/user';
import { ClientRepository } from './db/client';

import { modelContainer } from './../model/container';
import { UserDocument } from '../model/user';
import { Model } from 'mongoose';
import { ClientDocument } from '../model/client';

const userRepository = new UserRepository(
    modelContainer.get(TYPES.userModel) as Model<UserDocument>
);

const clientRepository = new ClientRepository(
  modelContainer.get(TYPES.clientModel) as Model<ClientDocument>
);

const repositoryContainer = new Map<symbol, Repository>();

repositoryContainer.set(TYPES.clientRepository, clientRepository);
repositoryContainer.set(TYPES.userRepository, userRepository);

export { repositoryContainer };
