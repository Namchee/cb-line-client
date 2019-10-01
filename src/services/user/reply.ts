/* eslint-disable max-len */

/**
 * User-related service reply, import it ONLY in user-related services
 */
export enum USER_REPLY {
  NO_ASSOCIATE = 'Akun dalam provider ini belum diasosiasikan dengan identitas manapun.',
  NOT_REGISTERED = 'Nomor identitas ini belum terdaftar.',
  ALREADY_REGISTERED = 'Identitas ini sudah diasosiasikan dengan akun lain dalam provider yang sama.',
  INPUT_NOMOR = 'Mohon masukkan nomor identitas yang akan diasosiasikan dengan akun ini.',
  MISMATCHED_NOMOR = 'Nomor identitas yang anda masukkan salah, mohon masukkan ulang nomor identitas anda.',
  INPUT_ASSOCIATE = 'Mohon masukkan nomor identitas lama yang diasosiasikan dengan akun ini',
  INPUT_NEW_ASSOCIATE = 'Mohon masukkan nomor identitas baru yang akan diasosiasikan dengan akun ini.',
  CREATE_SUCCESS = 'Akun berhasil dibuat.',
  CHANGE_SUCCESS = 'Perubahan identitas berhasil dilakukan.',
  DELETE_SUCCESS = 'Akun berhasil dihapus.',
};
