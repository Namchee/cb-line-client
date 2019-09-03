export interface ServiceResult {
  state: number;
  message: string | string[];
}

export interface Service {
  handle(
    id: string,
    state: number,
    text: string,
  ): ServiceResult | Promise<ServiceResult>;
}
