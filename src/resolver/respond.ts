import {
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
} from '@line/bot-sdk';
import { lineClient } from '../line/client';

/**
 * Resolver for line webhook event.
 * Basically, it just send the request somewhere
 * and reply it, nothing more.
 *
 * @export
 * @param {line.WebhookEvent} event Webhook event
 * @return {Promise<MessageAPIResponseBase | null>}
 * A resolved promise with successful message
 * OR `null` if unparseable.
 */
export function respond(
  event: WebhookEvent
): Promise<MessageAPIResponseBase | null> {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const message: TextMessage = {
    type: 'text',
    text: event.message.text,
  };

  // use reply API
  return lineClient.replyMessage(event.replyToken, message);
}
