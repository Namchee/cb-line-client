import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  nama: string;

  @Column({ type: 'text', nullable: false })
  client_id: string;

  @Column({ type: 'text', nullable: false })
  @Index()
  url: string;
}
