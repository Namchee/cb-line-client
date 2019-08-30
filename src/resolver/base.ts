import { ClientRepository } from '../repository/client';
import { UserState, State } from './../state/state';

export abstract class Resolver {
  private clientRepository: ClientRepository;

  public constructor(repository: ClientRepository) {
    this.clientRepository = repository;
  }

  private setState(
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

  private getState(
    provider: string,
    id: string
  ): State | undefined {
    return UserState.getState(provider, id);
  }

  private isClientRegistered(
    provider: string,
    client: string
  ): Promise<boolean> {
    return this.clientRepository.exist(`${provider}@${client}`);
  }
}
