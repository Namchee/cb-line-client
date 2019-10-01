import { ClientRepository } from '../repository/client';
import { UserState, State } from '../state/state';
import { RequestBody } from '../types/body';
import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { provider } from '../types/provider';
import { createError } from './../types/error';
import { RESPOND } from './response';
import { formatMessage } from '../services/formatter/factory';
import { Service } from '../services/service';

export class Resolver {
  private readonly clientRepository: ClientRepository;
  private readonly serviceContainer: Map<string, Service>;

  public constructor(
    repository: ClientRepository,
    serviceContainer: Map<string, Service>
  ) {
    this.clientRepository = repository;
    this.serviceContainer = serviceContainer;
  }

  public handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const body: RequestBody = req.body;

    const providerName = provider.get(body.provider);
    const clientId = body.client;
    const userId = `${providerName}@${body.message.userId}`;
    const text = body.message.message;

    if (!providerName) {
      return next(createError(RESPOND.UNKNOWN_CLIENT, 400));
    }

    const existence = await this.clientRepository.exist(clientId);

    if (!existence) {
      return next(createError(RESPOND.UNREGISTERED, 401));
    }

    const userState = UserState.getState(body.provider, body.message.userId);

    let state: number;
    let serviceName: string;

    if (userState) {
      if (this.checkRequestExpiration(userState)) {
        UserState.deleteState(providerName, userId);

        const message = formatMessage(providerName, RESPOND.EXPIRED);

        return next(createError(message));
      }

      state = userState.state;
      serviceName = userState.service;
    } else {
      state = 0;
      serviceName = text.split(' ')[0];
    }

    const service = this.serviceContainer.get(serviceName);

    if (!service) {
      const message = formatMessage(providerName, RESPOND.UNPARSEABLE);

      return next(createError(message));
    }

    try {
      const result = await service.handle(userId, state, text);

      this.updateUserState(providerName, userId, serviceName, result.state);

      const message = formatMessage(providerName, result.message);

      return res.status(200)
        .json({
          data: message,
          error: null,
        });
    } catch (err) {
      const message = formatMessage(providerName, err.message);

      return next(createError(message));
    }
  }

  private updateUserState(
    provider: string,
    id: string,
    serviceName: string,
    state: number
  ): void {
    const userState = UserState.getState(provider, id);

    if (state) {
      if (userState) {
        UserState.modifyState(
          provider,
          id,
          serviceName,
          state,
          new Date()
        );
      } else {
        UserState.createNewState(
          provider,
          id,
          serviceName,
          state,
          new Date()
        );
      }
    } else {
      if (userState) {
        UserState.deleteState(provider, id);
      }
    }
  }

  private checkRequestExpiration(state: State): boolean {
    const lastUpdate = state.last_updated.getTime();

    return Date.now() - lastUpdate > 300000;
  }
}
