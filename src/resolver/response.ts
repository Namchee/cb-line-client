/* eslint-disable max-len */

export enum RESPOND {
  NO_BODY = 'Invalid request body',
  UNKNOWN_CLIENT = 'Messaging client is not supported... YET',
  UNREGISTERED = 'Client has not yet registered in our database',
  EXPIRED = 'Mohon maaf, tapi permintaan anda sudah expired, waktu tenggang maksimal untuk sebuah permintaan adalah 5 menit. Mohon ulang permintaan anda.',
  UNPARSEABLE = 'Mohon maaf, namun permintaan anda tidak dapat dipahami. Silahkan coba lagi.'
}
