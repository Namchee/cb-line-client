import {
  Parser,
  Bidang,
  MahasiswaInfo,
  BadNPMError,
  jenjang,
  fakultas,
} from './parser';

const jurusan: Map<string, Bidang> = new Map([
  // D3
  ['910', { ilmu: 'Manajemen Perusahaan', jenjang: '5', fakultas: '1' }],

  // S1
  ['110', { ilmu: 'Ekonomi Pembangunan', jenjang: '6', fakultas: '1' }],
  ['120', { ilmu: 'Manajemen', jenjang: '6', fakultas: '1' }],
  ['130', { ilmu: 'Akuntansi', jenjang: '6', fakultas: '1' }],

  ['200', { ilmu: 'Ilmu Hukum', jenjang: '6', fakultas: '2' }],

  ['310', { ilmu: 'Ilmu Administrasi Publik', jenjang: '6', fakultas: '3' }],
  ['320', { ilmu: 'Ilmu Administrasi Bisnis', jenjang: '6', fakultas: '3' }],
  ['330', { ilmu: 'Ilmu Hubungan Internasional', jenjang: '6', fakultas: '3' }],

  ['410', { ilmu: 'Teknik Sipil', jenjang: '6', fakultas: '4' }],
  ['420', { ilmu: 'Arsitektur', jenjang: '6', fakultas: '4' }],

  ['510', { ilmu: 'Ilmu Filsafat', jenjang: '6', fakultas: '5' }],

  ['610', { ilmu: 'Teknik Industri', jenjang: '6', fakultas: '6' }],
  ['620', { ilmu: 'Teknik Kimia', jenjang: '6', fakultas: '6' }],
  ['630', { ilmu: 'Teknik Elektro', jenjang: '6', fakultas: '6' }],

  ['710', { ilmu: 'Matematika', jenjang: '6', fakultas: '7' }],
  ['720', { ilmu: 'Fisika', jenjang: '6', fakultas: '7' }],
  ['730', { ilmu: 'Teknik Informatika', jenjang: '6', fakultas: '7' }],

  // Pasca Sarjana
  ['801', { ilmu: 'Ilmu Administrasi Bisnis', jenjang: '8', fakultas: '8' }],
  ['811', { ilmu: 'Manajemen', jenjang: '8', fakultas: '8' }],
  ['812', { ilmu: 'Ilmu Ekonomi', jenjang: '9', fakultas: '8' }],
  ['821', { ilmu: 'Ilmu Hukum', jenjang: '8', fakultas: '8' }],
  ['822', { ilmu: 'Ilmu Hukum', jenjang: '9', fakultas: '8' }],
  ['831', { ilmu: 'Teknik Sipil', jenjang: '8', fakultas: '8' }],
  ['832', { ilmu: 'Ilmu Teknik Sipil', jenjang: '9', fakultas: '8' }],
  ['841', { ilmu: 'Arsitektur', jenjang: '8', fakultas: '8' }],
  ['842', { ilmu: 'Arsitektur', jenjang: '9', fakultas: '8' }],
  ['851', { ilmu: 'Ilmu Sosial', jenjang: '8', fakultas: '8' }],
  ['861', { ilmu: 'Ilmu Teologi', jenjang: '8', fakultas: '8' }],
  ['871', { ilmu: 'Teknik Kimia', jenjang: '8', fakultas: '8' }],
  ['881', { ilmu: 'Magister Teknik Industri', jenjang: '8', fakultas: '8' }],
  ['891', {
    ilmu: 'Magister Hubungan Internasional',
    jenjang: '8',
    fakultas: '8',
  }],
]);

export class ParserLama implements Parser {
  public parse(npm: string): MahasiswaInfo {
    const bidang_studi = jurusan.get(npm.substring(4, 7));

    if (!this.isValidFormat(npm) || !bidang_studi || !bidang_studi.fakultas) {
      throw new BadNPMError();
    }

    const fakultasMahasiswa = fakultas.get(bidang_studi.fakultas);
    const jenjangMahasiswa = jenjang.get(npm.substring(0, 1));

    if (!fakultasMahasiswa || !jenjangMahasiswa) {
      throw new BadNPMError();
    }

    return {
      tahun: npm.substring(0, 4),
      bidang_studi: {
        ilmu: bidang_studi.ilmu,
        fakultas: fakultasMahasiswa,
        jenjang: jenjangMahasiswa,
      },
      nomor: npm.substring(7, 10),
    };
  }

  public isValidFormat(npm: string): boolean {
    if (npm.length !== 10) {
      return false;
    }

    const year = Number.parseInt(npm.substring(0, 4));

    if (isNaN(year) || year < 1955 || year > 2017) {
      return false;
    }

    const bidang = jurusan.get(npm.substring(4, 7));

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

    return true;
  }
}
