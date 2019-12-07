import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { User } from './user';

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  provider: string;

  @Column({ type: 'text', nullable: false })
  @Index()
  account: string;

  @ManyToOne(type => User, user => user.account)
  @JoinColumn({ name: 'userid' })
  user: User;
}
