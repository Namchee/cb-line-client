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

  @Column({ type: 'varchar', length: 10 })
  provider: string;

  @Column('text')
  @Index()
  account: string;

  @ManyToOne(type => User, user => user.account)
  @JoinColumn({ name: 'userid' })
  user: User;
}
