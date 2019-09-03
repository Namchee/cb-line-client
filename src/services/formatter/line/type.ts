export interface TemplateType {
  type: string;
}

export interface ButtonsTemplate extends TemplateType {
  text?: string;
  actions: ActionButton[];
}

export interface CarouselTemplate extends TemplateType {
  text?: string;
  columns: CarouselItem[];
}

export interface CarouselItem {
  text: string;
}

export interface ActionButton {
  type: string;
  label: string;
  text: string;
}
