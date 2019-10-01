import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToMany,
  JoinTable,
  BaseEntity,
} from 'typeorm';
import { Kelas } from './kelas';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  @Index()
  nomor: string;

  @Column({ type: 'varchar', length: 10 })
  nama: string;

  @Column({ type: 'smallint', nullable: false })
  role: number;

  @ManyToMany(type => Kelas)
  @JoinTable({
    name: 'pesertamatakuliah',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'kelasId',
      referencedColumnName: 'id',
    },
  })
  kelas: Kelas[];
}
