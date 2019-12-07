/* eslint-disable max-len */

/**
 * Common reply message, import it in any services you like
 */
export enum REPLY {
  WRONG_FORMAT ='Permintaan anda tidak dapat dimengerti, mohon perbaiki perintah anda.',
  ERROR = 'Terjadi error pada server, mohon hubungi developer',
}

/**
 * User-related service reply, useful for user service handling
 */
export enum USER_REPLY {
  NO_ASSOCIATE = 'Akun dalam provider ini belum diasosiasikan dengan identitas manapun.',
  NOT_REGISTERED = 'Nomor identitas ini belum terdaftar.',
  ALREADY_REGISTERED = 'Identitas ini sudah diasosiasikan dengan akun lain dalam provider yang sama.',
  INPUT_NOMOR = 'Mohon masukkan nomor identitas yang akan diasosiasikan dengan akun ini.',
  MISMATCHED_NOMOR = 'Nomor identitas yang anda masukkan salah, mohon masukkan ulang nomor identitas anda.',
  INPUT_ASSOCIATE = 'Mohon masukkan nomor identitas lama yang diasosiasikan dengan akun ini',
  INPUT_NEW_ASSOCIATE = 'Mohon masukkan nomor identitas baru yang akan diasosiasikan dengan akun ini.',
  SAME_NOMOR = 'Nomor identitas yang anda ajukan sama persis dengan nomor identitas lama anda.',
  CREATE_SUCCESS = 'Akun berhasil dibuat.',
  CHANGE_SUCCESS = 'Perubahan identitas berhasil dilakukan.',
  DELETE_SUCCESS = 'Akun berhasil dihapus.',
};

/**
 * Smart service related reply, useful for smart service handling
 */
export enum SMART_REPLY {
  CHOOSE_RUANGAN = 'Silahkan memilih ruangan yang diinginkan.\n\n(Anda dapat mengetik nomor ruangan yang anda inginkan).',
  RUANGAN_UNKNOWN = 'Ruangan yang anda cari tidak dikenali, mohon perbaiki masukkan anda.',
  RUANGAN_FREE = 'Pada hari ini, ruangan tersebut tidak digunakan untuk kelas apapun.',
  RUANGAN_HEADER = 'Pada hari ini, ruangan tersebut akan kosong pada: ',
  CHOOSE_MATA_KULIAH = 'Silahkan masukkan nama mata kuliah yang diinginkan'
}
