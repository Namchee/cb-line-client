import {
  Column,
  PrimaryGeneratedColumn,
  Index,
  Entity,
} from 'typeorm';

@Entity()
export class MataKuliah {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'character', length: 11, nullable: false })
  @Index()
  kode: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nama: string;
}
