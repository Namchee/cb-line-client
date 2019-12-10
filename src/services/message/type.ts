import { ServerError } from '../../types/error';

export class MessageBody {
  public readonly type: string; // text or button, nothing else
  public readonly text: string;
  public readonly label?: string;
  private static readonly validTypes = ['text', 'button'];

  private constructor(type: string, text: string, label?: string) {
    if (!MessageBody.validTypes.includes(type)) {
      throw new ServerError(
        'Invalid message body type, should only be "text" or "button"',
        500
      );
    }

    this.type = type;
    this.text = text;

    if (type === 'button' && !label) {
      throw new ServerError(
        'You must include label for "button" message type',
        500
      );
    }

    // to avoid 400 from LINE
    this.label = (label) ? label.substring(0, 20) : undefined;
  }

  public static createTextBody(text: string): MessageBody {
    return new MessageBody('text', text);
  }

  public static createButtonBody(label: string, text: string): MessageBody {
    return new MessageBody('button', text, label);
  }
}

export class Message {
  public readonly type: string; // check validTypes
  public readonly body: MessageBody[];
  private static readonly validTypes = ['base', 'buttons', 'carousel'];

  private constructor(type: string, body: MessageBody[]) {
    if (!Message.validTypes.includes(type)) {
      throw new ServerError(
        'Invalid message type, check the validTypes',
        500
      );
    }

    this.type = type;
    this.body = body;
  }

  public static createTextMessage(body: MessageBody[]): Message {
    return new Message('base', body);
  }

  public static createButtonsMessage(body: MessageBody[]): Message {
    const isButtonInside = body.some(message => message.type === 'button');

    if (!isButtonInside) {
      throw new ServerError(
        'Invalid type "button", the message does not contain button',
        500
      );
    }

    return new Message('buttons', body);
  }

  public static createCarouselMessage(body: MessageBody[]): Message {
    return new Message('carousel', body);
  }
}
