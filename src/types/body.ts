export interface RequestBody {
  provider: string;
  client: string;
  message: {
    userId: string;
    message: string;
  };
}

export interface ResponseBody {
  data: any;
  error: string[];
}

export function isRequestBody(object: any): object is RequestBody {
  return object.provider &&
    typeof object.provider === 'string' &&
    object.client &&
    typeof object.client === 'string' &&
    object.message &&
    typeof object.message === 'object' &&
    object.message.usedId &&
    typeof object.message.userId === 'string' &&
    object.message.message &&
    typeof object.message.message === 'string';
}
