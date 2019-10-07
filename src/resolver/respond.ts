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

  const reqBody = makeRequest(event.source.userId, event.message.text);

  try {
    const response = await axios({
      method: 'POST',
      url: clientConfig.serviceURL,
      timeout: 5000,
      data: reqBody,
    });

    return lineClient.replyMessage(event.replyToken, response.data.data);
  } catch (err) {
    if (err.response.data.data) {
      return lineClient.replyMessage(event.replyToken, err.response.data.data);
    } else if (err.code === 'ECONNABORTED') {
      const message: TextMessage = {
        type: 'text',
        // eslint-disable-next-line max-len
        text: 'Mohon maaf, namun sepertinya server sedang sibuk. Mohon coba dalam beberapa saat lagi',
      };

      return lineClient.replyMessage(event.replyToken, message);
    } else {
      console.error(`Failed with status code ${err.response.status}`);
      console.error(err.response.data.error);

      return Promise.resolve(null);
    }
  }
}
