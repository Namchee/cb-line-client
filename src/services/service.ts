import { Button } from './formatter/type';

export interface ServiceResult {
  state: number;
  message: string | string[] | Button[];
}

export type ServiceHandler = (
  id: string,
  text: string
) => ServiceResult | Promise<ServiceResult>;

export abstract class Service {
  protected static handler: ServiceHandler[];

  public abstract handle(
    id: string,
    state: number,
    text: string,
  ): ServiceResult | Promise<ServiceResult>;
}
