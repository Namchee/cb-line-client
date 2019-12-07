export interface TemplateMessage {
  type: string;
  text: string;
  message: string[];
}

export interface ServiceResult {
  state: number;
  message: string | TemplateMessage;
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
