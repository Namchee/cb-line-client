import { Button } from './formatter/type';
import { UserAccountRepository } from '../repository/user-account';

export interface ServiceResult {
  state: number;
  message: string | string[] | Button[];
}

export type ServiceHandler = (
  provider: string,
  account: string,
  text: string
) => Promise<ServiceResult>;

export abstract class Service {
  protected readonly userAccountRepository: UserAccountRepository;
  protected static handler: ServiceHandler[];

  public constructor(userAccountRepository: UserAccountRepository) {
    this.userAccountRepository = userAccountRepository;
  }

  public abstract handle(
    provider: string,
    account: string,
    state: number,
    text: string,
  ): Promise<ServiceResult>;
}
