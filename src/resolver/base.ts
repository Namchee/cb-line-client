import { ClientRepository } from '../repository/db/client';
import { UserState, State } from './../state/state';
import { ErrorHandler } from '../service/base/service';
import { RequestBody, ResponseBody } from '../types/body';

export abstract class Resolver<T> {
  private clientRepository: ClientRepository;
  private errorHandler: ErrorHandler<T>;

  public constructor(
    repository: ClientRepository,
    errorHandler: ErrorHandler<T>
  ) {
    this.clientRepository = repository;
    this.errorHandler = errorHandler;
  }

  protected setState(
    provider: string,
    id: string,
    service: string,
    state: number,
    last_updated: Date
  ): void {
    if (this.getState(provider, id)) {
      UserState.modifyState(
        provider,
        id,
        service,
        state,
        last_updated
      );
    } else {
      UserState.createNewState(
        provider,
        id,
        service,
        state,
        last_updated
      );
    }
  }

  protected getState(
    provider: string,
    id: string
  ): State | undefined {
    return UserState.getState(provider, id);
  }

  protected isClientRegistered(
    provider: string,
    client: string
  ): Promise<boolean> {
    return this.clientRepository.exist(`${provider}@${client}`);
  }

  public abstract async handleClientRequest(
    request: RequestBody
  ): Promise<ResponseBody>;
}
