import { generateLineMessage } from './line/factory';
import { Button } from './type';

export function formatMessage(
  provider: string,
  message: string | string[] | Button[]
): any {
  switch (provider) {
    case 'line': return generateLineMessage(message);
  }
}
