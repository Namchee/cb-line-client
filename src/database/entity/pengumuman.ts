import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { MataKuliah } from './mata-kuliah';

@Entity()
export class Pengumuman extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  isiPengumuman: string;

  @ManyToOne(type => MataKuliah)
  @JoinColumn({ name: 'matakuliahId' })
  matakuliahId: number;
}
