import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  BaseEntity,
  ManyToOne,
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
  waktuMulai: Date;

  @Column({ type: 'time', nullable: false })
  waktuSelesai: Date;

  @Column({ type: 'smallint', nullable: false })
  hari: number;
}
