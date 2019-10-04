import 'regenerator-runtime';
import axios from 'axios';
import {
  WebhookEvent,
  MessageAPIResponseBase,
  TextMessage,
} from '@line/bot-sdk';
import { lineClient } from '../line/client';
import { makeRequest } from './request';
import { clientConfig } from '../config/config';

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
export async function respond(
  event: WebhookEvent
): Promise<MessageAPIResponseBase | null> {
  if (
    event.type !== 'message' ||
    event.message.type !== 'text' ||
    event.source.type != 'user'
  ) {
    return Promise.resolve(null);
  }

  const text: TextMessage = {
    type: 'text',
    text: event.message.text,
  };

  return lineClient.replyMessage(event.replyToken, text);

  /*

  const reqBody = makeRequest(event.source.userId, event.message.text);

  try {
    const response = await axios.post(clientConfig.serviceURL, reqBody);

    return lineClient.replyMessage(event.replyToken, response.data.data);
  } catch (err) {
    return lineClient.replyMessage(event.replyToken, err.response.data.error);
  }
  */
}
