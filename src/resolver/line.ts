import { Resolver } from './base';
import { lineServiceContainer } from '../service/line/container';
import { LineMessage } from '../service/line/messages/factory';
import { ClientRepository } from '../repository/db/client';
import { ErrorHandler, LineService } from '../service/base/service';
import { Request, Response } from 'express';
import { ResponseBody, RequestBody } from '../types/body';
import { State } from '../state/state';

export class LineResolver extends Resolver<LineMessage> {
  public constructor(
    repository: ClientRepository,
    errorHandler: ErrorHandler<LineMessage>
  ) {
    super(repository, errorHandler);
  }

  public async handleClientRequest(
    request: RequestBody
  ): Promise<ResponseBody> {
    const client = request.client;
    const userId = request.message.userId;

    const exist = await this.isClientRegistered('line', client);

    if (!exist) {
      return {
        data: null,
        error: [
          'Client has not been registered yet',
        ],
      };
    }

    try {
      const state: State | undefined = this.getState('line', userId);

      if (state) {
        const service: LineService | undefined = lineServiceContainer.get(
          state.service
        );

        if (service) {
          service.han
        } else {
          throw new Error('Shouldn\'t happen');
        }
      } else {
        const serviceName: string = request.message.message.split(' ')[0];
      }
    } catch (err) {
      
    }
  }
}