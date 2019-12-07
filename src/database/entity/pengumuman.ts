import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Matakuliah } from './mata-kuliah';

@Entity()
export class Pengumuman extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  tanggal: Date;

  @Column({ type: 'text', nullable: false })
  isiPengumuman: string;

  @ManyToOne(type => Matakuliah)
  @JoinColumn({ name: 'matakuliahId' })
  matakuliahId: number;
}
