import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { MataKuliah } from './mata-kuliah';
import { Ruangan } from './ruangan';

@Entity()
export class Kelas extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => MataKuliah)
  @JoinColumn({ name: 'matakuliah' })
  mataKuliah: MataKuliah;

  @Column('smallint')
  jenis: number;

  @Column({ type: 'varchar', length: 3 })
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
