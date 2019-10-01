export interface RequestBody {
  provider: string;
  client: string;
  message: {
    userId: string;
    message: string;
  };
}

export function isRequestBody(object: any): object is RequestBody {
  return object && object.provider &&
    typeof object.provider === 'string' &&
    object.client &&
    typeof object.client === 'string' &&
    object.message &&
    typeof object.message === 'object' &&
    object.message.userId &&
    typeof object.message.userId === 'string' &&
    object.message.message &&
    typeof object.message.message === 'string';
}
