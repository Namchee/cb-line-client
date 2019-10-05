import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity()
export class Client {
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
