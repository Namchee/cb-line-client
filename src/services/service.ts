import { Button } from './formatter/type';

export interface ServiceResult {
  state: number;
  message: string | string[] | Button[];
}

export interface Service {
  handle(
    id: string,
    state: number,
    text: string,
  ): ServiceResult | Promise<ServiceResult>;
}
