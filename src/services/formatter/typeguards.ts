import { Button } from './type';

export function isStringArray(obj: any): obj is string[] {
  if (Array.isArray(obj) && typeof obj[0] === 'string') {
    return true;
  }

  return false;
}

export function isButtonArray(obj: any): obj is Button[] {
  if (Array.isArray(obj) &&
    obj.length > 0 &&
    Object.keys(obj[0]).length === 2 &&
    (obj[0] as Button).label &&
    (obj[0] as Button).text) {
    return true;
  }

  return false;
}
