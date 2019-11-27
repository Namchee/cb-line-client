import { RequestBody } from '../types/types';

/**
 * Formats your request to match hub specification
 *
 * @export
 * @param {string} userId User's ID (not client ID)
 * @param {string} message User's message
 * @return {RequestBody} Formatted body
 */
export function makeRequest(userId: string, message: string): RequestBody {
  return {
    provider: 'line',
    client: userId,
    message: {
      userId,
      message,
    },
  };
}
