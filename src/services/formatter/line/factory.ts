import {
  TemplateType,
  ButtonsTemplate,
  CarouselTemplate,
  ActionButton,
  CarouselItem,
} from './type';
import { TemplateMessage as BaseTemplateMessage } from './../../base';
import { ServerError } from '../../../types/error';

export abstract class LineMessage {
  public readonly type: string;

  public constructor(type: string) {
    if (!LineMessage.isValidType(type)) {
      throw new Error('Invalid Type');
    }

    this.type = type;
  }

  /**
   * Memeriksa apakah type messagenya valid atau tidak.
   * Tujuannya adalah mencegah seseorang memasukkan hal gila
   * dan bikin appnya jadi meledak jelas (yup, gw sedang menatap
   * future self).
   *
   * @static
   * @param {string} type Type message
   * @return {boolean} `true` kalau ada di spec LINE API,
   * `false` kalau gak ada.
   * @memberof LineMessage
   */
  private static isValidType(type: string): boolean {
    return type === 'text' ||
      type === 'template' ||
      type === 'image' ||
      type === 'video' ||
      type === 'audio' ||
      type === 'location' ||
      type === 'sticker' ||
      type === 'imagemap' ||
      type === 'flex';
  }
}

export class TextMessage extends LineMessage {
  public readonly text: string;

  public constructor(text: string) {
    super('text');
    this.text = text;
  }
}

abstract class TemplateMessage extends LineMessage {
  public readonly template: TemplateType;
  public readonly altText: string;

  public constructor(template: TemplateType) {
    super('template');
    this.altText = '\0';
    this.template = template;
  }
}

export class ButtonsMessage extends TemplateMessage {
  public constructor(template: ButtonsTemplate) {
    super(template);
  }
}

export class CarouselMessage extends TemplateMessage {
  public constructor(template: CarouselTemplate) {
    super(template);
  }
}

export function generateActionButton(
  label: string,
  text: string
): ActionButton {
  return {
    type: 'message',
    label,
    text,
  };
}

export function generateCarouselItem(
  text: string,
): CarouselItem {
  return {
    text,
  };
}

export function generateButtonsTemplate(
  text: string,
  buttons: ActionButton[]
): ButtonsTemplate {
  return {
    type: 'buttons',
    text,
    actions: buttons,
  };
}

export function generateCarouselTemplate(
  items: CarouselItem[]
): CarouselTemplate {
  return {
    type: 'carousel',
    columns: items,
  };
}

export function generateLineMessage(
  message: string | BaseTemplateMessage
): LineMessage {
  if (typeof message === 'string') {
    return new TextMessage(message);
  } else {
    switch (message.type) {
      case 'buttons': {
        const actionButtons = [];

        for (const button of message.message) {
          actionButtons.push(generateActionButton(button, button));
        }

        const buttonsTemplate = generateButtonsTemplate(
          message.text,
          actionButtons
        );

        return new ButtonsMessage(buttonsTemplate);
      }
      case 'carousel': {
        const carouselItems: CarouselItem[] = [];

        for (const column of message.message) {
          carouselItems.push(generateCarouselItem(column));
        }

        const carouselTemplate: CarouselTemplate = generateCarouselTemplate(
          carouselItems,
        );

        return new CarouselMessage(carouselTemplate);
      }
      default: {
        throw new ServerError(`Unknown message type '${message.type}'`, 500);
      }
    }
  }
}
