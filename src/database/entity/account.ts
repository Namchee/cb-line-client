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

  @Column('text')
  @Index()
  account: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
