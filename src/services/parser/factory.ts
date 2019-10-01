import { ParserBaru } from './baru';
import { ParserLama } from './lama';
import { MahasiswaInfo, BadNPMError } from './parser';

export class ParserFactory {
  public static isValidNPM(npm: string): boolean {
    const baru = new ParserBaru();
    const lama = new ParserLama();

    if (baru.isValidFormat(npm) || lama.isValidFormat(npm)) {
      return true;
    }

    return false;
  }

  public static getMahasiswaInfo(npm: string): MahasiswaInfo {
    const baru = new ParserBaru();

    if (baru.isValidFormat(npm)) {
      return baru.parse(npm);
    }

    const lama = new ParserLama();

    if (lama.isValidFormat(npm)) {
      return lama.parse(npm);
    }

    throw new BadNPMError();
  }
}
