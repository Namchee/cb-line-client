import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
} from 'typeorm';

@Entity()
export class Ruangan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  @Index()
  nama: string;
}
