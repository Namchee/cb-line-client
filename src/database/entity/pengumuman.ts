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
  tanggal: string;

  @Column({ type: 'text', nullable: false })
  isipengumuman: string;

  @ManyToOne(type => Matakuliah)
  @JoinColumn({ name: 'matakuliahid' })
  matakuliahid: number;
}
