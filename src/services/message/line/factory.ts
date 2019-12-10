import {
  LineMessage,
  TextMessage,
  LineMessageComponent,
  TextMessageComponent,
  LineAction,
  ButtonMessageComponent,
  BoxContainer,
  BubbleMessage,
  FlexMessage,
} from './type';
import { Message } from '../type';
import { ServerError } from '../../../types/error';

function generateLineMessage(
  message: Message
): LineMessage {
  switch (message.type) {
    case 'base': {
      if (message.body.length > 1) {
        throw new ServerError('"base" message should only contain 1 body', 500);
      }

      return new TextMessage(message.body[0].text);
    }
    case 'buttons': {
      const messageComponents: LineMessageComponent[] = [];

      for (const content of message.body) {
        if (content.type === 'text') {
          messageComponents.push(new TextMessageComponent(content.text));
        } else {
          if (!content.label) {
            throw new ServerError('Screams in Arstotzkan', 500);
          }

          const action = new LineAction(content.label, content.text);
          const buttonComponent = new ButtonMessageComponent(action);

          messageComponents.push(buttonComponent);
        }
      }

      const boxContainer = new BoxContainer(messageComponents);
      const bubbleMessage = new BubbleMessage(boxContainer);

      return new FlexMessage(bubbleMessage);
    }
    default: throw new ServerError('Invalid message type', 500);
  }
}

export function formatMessageToLine(
  messages: Message[]
): LineMessage | LineMessage[] {
  if (messages.length === 1) {
    return generateLineMessage(messages[0]);
  } else {
    const messageArray: LineMessage[] = [];

    messages.forEach((message) => {
      messageArray.push(generateLineMessage(message));
    });

    return messageArray;
  }
}

