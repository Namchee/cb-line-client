export interface Parser {
  parse(npm: string): MahasiswaInfo;
  isValidFormat(npm: string): boolean;
}

export interface Bidang {
  ilmu: string;
  jenjang?: string;
  fakultas?: string;
}

export interface MahasiswaInfo {
  tahun: string;
  bidang_studi?: Bidang;
  nomor: string;
  jenis?: string;
}

export const jenjang: Map<string, string> = new Map([
  ['5', 'D3'],
  ['6', 'S1'],
  ['7', 'Profesi'],
  ['8', 'S2'],
  ['9', 'S3'],
]);

export const fakultas: Map<string, string> = new Map([
  ['1', 'Ekonomi'],
  ['2', 'Hukum'],
  ['3', 'Ilmu Sosial dan Ilmu Politik'],
  ['4', 'Teknik'],
  ['5', 'Filsafat'],
  ['6', 'Teknologi Industri'],
  ['7', 'Teknologi Informasi dan Sains'],
  ['8', 'Sekolah Pascasarjana'],
]);

export class BadNPMError extends Error {
  public constructor() {
    super('Invalid NPM format, call `isValidFormat` first');
  }
}
