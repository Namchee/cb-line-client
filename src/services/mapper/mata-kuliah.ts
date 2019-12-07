import {
  Matakuliah as MataKuliahDocument,
} from '../../database/entity/mata-kuliah';
import { MataKuliah } from '../../entity/mata-kuliah';

export function toEntity(
  document: MataKuliahDocument
): MataKuliah {
  return MataKuliah.createMataKuliah(
    document.kode,
    document.nama,
  );
}
