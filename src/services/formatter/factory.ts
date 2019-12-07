import { generateLineMessage } from './line/factory';
import { TemplateMessage } from '../base';

export function formatMessage(
  provider: string,
  message: string | TemplateMessage
): any {
  switch (provider) {
    case 'line': return generateLineMessage(message);
  }
}
