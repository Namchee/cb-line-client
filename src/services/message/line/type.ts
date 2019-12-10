import { ServerError } from './../../../types/error';

export abstract class LineMessage {
  public readonly type: string;
  private static readonly validTypes = [
    'text',
    'template',
    'image',
    'video',
    'audio',
    'location',
    'sticker',
    'imagemap',
    'flex',
  ];

  public constructor(type: string) {
    if (!LineMessage.validTypes.includes(type)) {
      throw new ServerError('Invalid LINE message type', 500);
    }

    this.type = type;
  }
}

export class TextMessage extends LineMessage {
  public readonly text: string;

  public constructor(text: string) {
    super('text');
    this.text = text;
  }
}

export class FlexMessage extends LineMessage {
  public readonly altText: string;
  public readonly contents: FlexMessageContents;

  public constructor(contents: FlexMessageContents) {
    super('flex');
    this.altText = '\0'; // empty for now
    this.contents = contents;
  }
}

export abstract class FlexMessageContents {
  public readonly type: string;
  private static readonly validTypes = ['bubble', 'carousel'];

  public constructor(type: string) {
    if (!FlexMessageContents.validTypes.includes(type)) {
      throw new ServerError('Invalid flex message contents type', 500);
    }

    this.type = type;
  }
}

/**
 * Other stuff are unsupported ATM
 */
export class BubbleMessage extends FlexMessageContents {
  public readonly body: BoxContainer;

  public constructor(body: BoxContainer) {
    super('bubble');

    this.body = body;
  }
}

export class CarouselMessage extends FlexMessageContents {
  public readonly contents: BubbleMessage[];

  public constructor(contents: BubbleMessage[]) {
    super('carousel');

    this.contents = contents;
  }
}

export class BoxContainer {
  public readonly type: string;
  public readonly layout: string;
  public readonly spacing: string;
  public readonly contents: LineMessageComponent[];

  public constructor(contents: LineMessageComponent[]) {
    this.type = 'box';
    this.layout = 'vertical';
    this.spacing = 'sm';
    this.contents = contents;
  }
}

export abstract class LineMessageComponent {
  public readonly type: string;

  private static readonly validTypes = ['text', 'button'];

  public constructor(type: string) {
    if (!LineMessageComponent.validTypes.includes(type)) {
      throw new ServerError(
        'Invalid / Unsupported message component type',
        500
      );
    }

    this.type = type;
  }
}

/**
 * Cannot be customized ATM
 */
export class TextMessageComponent extends LineMessageComponent {
  public readonly text: string;
  public readonly size?: string;
  public readonly color?: string;
  public readonly wrap?: boolean;

  public constructor(text: string) {
    super('text');

    this.text = text;
    this.wrap = true;
  }
}

export class ButtonMessageComponent extends LineMessageComponent {
  public readonly action: LineAction;

  public constructor(action: LineAction) {
    super('button');

    this.action = action;
  }
}

/**
 * Other are unsupported ATM
 */
export class LineAction {
  public readonly type: string;
  public readonly label: string;
  public readonly text: string;

  public constructor(label: string, text: string) {
    this.type = 'message';
    this.label = label;
    this.text = text;
  }
}
