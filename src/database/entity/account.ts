import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  provider: string;

  @Column('text')
  @Index()
  account: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
