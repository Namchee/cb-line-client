import { Ruangan as RuanganDocument } from '../../database/entity/ruangan';
import { Ruangan } from '../../entity/ruangan';

export function toEntity(document: RuanganDocument): Ruangan {
  return Ruangan.createRuangan(document.nama);
}
