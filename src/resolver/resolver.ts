import { ClientRepository } from '../repository/client';
import { UserState, State } from '../state/state';
import { RequestBody } from '../types/body';
import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { provider } from '../types/provider';
import { RESPOND } from './response';
import { formatMessage } from '../services/formatter/factory';
import { ServerError, isUserError } from '../types/error';
import { ServiceFactory } from '../services/factory';
import { Service, ServiceParameters } from '../services/service';

export class Resolver {
  private readonly clientRepository: ClientRepository;
  private readonly serviceFactory: ServiceFactory;

  public constructor(
    repository: ClientRepository,
    serviceFactory: ServiceFactory
  ) {
    this.clientRepository = repository;
    this.serviceFactory = serviceFactory;
  }

  public handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const body: RequestBody = req.body;

    const providerName = provider.get(body.provider);
    const clientId = body.client;
    const userId = body.message.userId;
    const text = body.message.message;

    if (!providerName) {
      return next(new ServerError(RESPOND.UNKNOWN_CLIENT, 401));
    }

    const existence = await this.clientRepository.exist(providerName, clientId);

    if (!existence) {
      return next(new ServerError(RESPOND.UNREGISTERED, 401));
    }

    const userState = UserState.getState(body.provider, body.message.userId);

    let state: number;

    let service = null;

    if (userState) {
      if (this.checkRequestExpiration(userState)) {
        UserState.deleteState(providerName, userId);

        const message = formatMessage(providerName, RESPOND.EXPIRED);

        return res.status(400)
          .json({
            data: message,
            error: null,
          });
      }

      state = userState.state;
      service = this.serviceFactory.createServiceByName(userState.service);
    } else {
      state = 0;
      service = this.serviceFactory.createService(text);
    }

    if (!service) {
      const message = formatMessage(providerName, RESPOND.UNPARSEABLE);

      return res.status(400)
        .json({
          data: message,
          error: null,
        });
    }

    try {
      const tex = userState ? userState.text + ' ' + text : text;

      const result = await service.handle(
        this.buildParameters(
          service,
          state,
          tex,
          clientId,
          providerName
        )
      );

      this.updateUserState(
        providerName,
        userId,
        service.identifier,
        result.state,
        text
      );

      const message = formatMessage(providerName, result.message);

      return res.status(200)
        .json({
          data: message,
          error: null,
        });
    } catch (err) {
      if (isUserError(err)) {
        const message = formatMessage(providerName, err.message);

        return res.status(400)
          .json({
            data: message,
            error: null,
          });
      } else {
        return next(err);
      }
    }
  }

  private updateUserState = (
    provider: string,
    id: string,
    serviceName: string,
    state: number,
    text: string
  ): void => {
    const userState = UserState.getState(provider, id);

    if (state) {
      if (userState) {
        UserState.modifyState(
          provider,
          id,
          serviceName,
          state,
          userState.text + ' ' + text,
          new Date()
        );
      } else {
        UserState.createNewState(
          provider,
          id,
          serviceName,
          state,
          text,
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

  private buildParameters(
    service: Service,
    state: number,
    text: string,
    account: string,
    provider: string
  ): ServiceParameters {
    if (service.userRelated) {
      return {
        state,
        text,
        account,
        provider,
      };
    } else {
      return {
        state,
        text,
      };
    }
  }
}
