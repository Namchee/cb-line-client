import { Button } from './formatter/type';
import { AccountRepository } from '../repository/account';

export interface ServiceResult {
  state: number;
  message: string | string[] | Button[];
}

export type ServiceHandler = (
  id: string,
  text: string
) => Promise<ServiceResult>;

export abstract class Service {
  protected readonly accountRepository: AccountRepository;
  protected static handler: ServiceHandler[];

  public constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  protected checkAccountExistence = async (id: string): Promise<boolean> => {
    return await this.accountRepository.exist(id);
  }

  public abstract handle(
    id: string,
    state: number,
    text: string,
  ): Promise<ServiceResult>;
}
