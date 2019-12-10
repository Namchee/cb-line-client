import { Message } from './message/type';

export interface ServiceResult {
  state: number;
  message: Message[];
}

export interface ServiceParameters {
  state: number;
  text: string;
  account?: string;
  provider?: string;
}

export interface HandlerParameters {
  text: string;
  account?: string;
  provider?: string;
}

export type ServiceHandler = (
  params: HandlerParameters
) => Promise<ServiceResult>;

export abstract class Service {
  public identifier: string;
  public userRelated: boolean;
  protected handler: ServiceHandler[];

  public abstract handle(params: ServiceParameters): Promise<ServiceResult>;
}

export abstract class SmartService extends Service {
  public keywords: string[];
}
