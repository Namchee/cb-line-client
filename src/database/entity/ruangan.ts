import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Ruangan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  @Index()
  nama: string;
}
