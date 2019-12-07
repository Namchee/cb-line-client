import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Matakuliah } from './mata-kuliah';
import { Ruangan } from './ruangan';

@Entity()
export class Kelas extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Matakuliah)
  @JoinColumn({ name: 'matakuliah' })
  mataKuliah: Matakuliah;

  @Column({ type: 'smallint', nullable: false })
  jenis: number;

  @Column({ type: 'varchar', length: 3, nullable: false })
  kode: string;

  @ManyToOne(type => Ruangan)
  @JoinColumn({ name: 'ruangan' })
  ruangan: Ruangan;

  @Column({ type: 'time', nullable: false })
  waktumulai: string;

  @Column({ type: 'time', nullable: false })
  waktuselesai: string;

  @Column({ type: 'smallint', nullable: false })
  hari: number;
}
