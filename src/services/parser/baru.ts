import {
  Parser,
  MahasiswaInfo,
  Bidang,
  BadNPMError,
  jenjang,
  fakultas,
} from './parser';

const jurusan: Map<string, Bidang> = new Map([
  ['01', { ilmu: 'Ilmu Ekonomi', fakultas: '1' }],
  ['02', { ilmu: 'Ekonomi Pembangunan', fakultas: '1' }],
  ['03', { ilmu: 'Manajemen', fakultas: '1' }],
  ['04', { ilmu: 'Akuntansi', fakultas: '1' }],

  ['05', { ilmu: 'Ilmu Hukum', fakultas: '2' }],

  ['06', { ilmu: 'Ilmu Sosial', fakultas: '8' }],

  ['07', { ilmu: 'Ilmu Administrasi Publik', fakultas: '3' }],
  ['08', { ilmu: 'Ilmu Administrasi Bisnis', fakultas: '3' }],
  ['09', { ilmu: 'Ilmu Hubungan Internasional', fakultas: '3' }],

  ['10', { ilmu: 'Teknik Sipil', fakultas: '4' }],
  ['11', { ilmu: 'Arsitektur', fakultas: '4' }],

  ['12', { ilmu: 'Ilmu Filsafat', fakultas: '5' }],

  ['13', { ilmu: 'Teknik Industri', fakultas: '6' }],
  ['14', { ilmu: 'Teknik Kimia', fakultas: '6' }],
  ['15', { ilmu: 'Teknik Elektro', fakultas: '6' }],

  ['16', { ilmu: 'Matematika', fakultas: '7' }],
  ['17', { ilmu: 'Fisika', fakultas: '7' }],
  ['18', { ilmu: 'Teknik Informatika', fakultas: '7' }],

  ['18', { ilmu: 'Humaniora' }],
]);

const jenis: Map<string, string> = new Map([
  ['01', 'Reguler'],
  ['02', 'Non Reguler'],
  ['03', 'Acisis'],
  ['04', 'Joint Degree'],
]);

export class ParserBaru implements Parser {
  public parse(npm: string): MahasiswaInfo {
    const bidang_studi = jurusan.get(npm.substring(1, 3));

    if (!this.isValidFormat(npm) || !bidang_studi || !bidang_studi.fakultas) {
      throw new BadNPMError();
    }

    const fakultasMahasiswa = fakultas.get(bidang_studi.fakultas);
    const jenjangMahasiswa = jenjang.get(npm.substring(0, 1));

    if (!fakultasMahasiswa || !jenjangMahasiswa) {
      throw new BadNPMError();
    }

    return {
      tahun: '20' + npm.substring(3, 5),
      bidang_studi: {
        ilmu: bidang_studi.ilmu,
        fakultas: fakultasMahasiswa,
        jenjang: jenjangMahasiswa,
      },
      nomor: npm.substring(7, 10),
      jenis: npm.substring(5, 7),
    };
  }

  public isValidFormat(npm: string): boolean {
    if (npm.length !== 10) {
      return false;
    }

    const year = Number.parseInt(npm.substring(3, 5));

    if (isNaN(year) || year < 2018) {
      return false;
    }

    const bidang = jurusan.get(npm.substring(1, 3));

    if (!bidang) {
      return false;
    }

    const fakultasMahasiswa = bidang.fakultas || '';
    const jenjangMahasiswa = bidang.jenjang || '';

    // Shouldn't happen
    if (!jenjang.has(jenjangMahasiswa) || !fakultas.has(fakultasMahasiswa)) {
      return false;
    }

    const nomor = Number.parseInt(npm.substring(7, 10));

    if (isNaN(nomor) || nomor < 0 || nomor > 999) {
      return false;
    }

    const jenisMahasiswa = npm.substring(5, 7);

    if (!jenis.get(jenisMahasiswa)) {
      return false;
    }

    return true;
  }
}
