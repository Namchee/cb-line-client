import { formatMessageToLine } from './line/factory';
import { Message } from './type';
import { ServerError } from '../../types/error';
import { LineMessage } from './line/type';

export function formatMessage(
  provider: string,
  messages: Message[]
): LineMessage | LineMessage[] { // add this later
  switch (provider) {
    case 'line': return formatMessageToLine(messages);
    default:
      throw new ServerError('Invalid provider when formatting message', 500);
  }
}
