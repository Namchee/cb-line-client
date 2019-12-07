import {
  Pengumuman as PengumumanDocument,
} from '../../database/entity/pengumuman';
import { Pengumuman } from '../../entity/pengumuman';

export function toEntity(document: PengumumanDocument): Pengumuman {
  return Pengumuman.createPengumuman(
    document.id,
    document.isiPengumuman,
  );
}
