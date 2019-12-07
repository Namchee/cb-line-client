import { Kelas as KelasDocument } from '../../database/entity/kelas';
import { Kelas } from '../../entity/kelas';
import { parse } from 'date-fns';

export function toEntity(document: KelasDocument): Kelas {
  return Kelas.createKelas(
    document.id,
    document.jenis,
    document.kode,
    parse(document.waktumulai, 'HH:mm:ss', new Date()),
    parse(document.waktuselesai, 'HH:mm:ss', new Date()),
    document.hari,
  );
}
