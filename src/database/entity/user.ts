import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToMany,
  JoinTable,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Kelas } from './kelas';
import { Account } from './account';

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

  @OneToMany(type => Account, account => account.user)
  account: Account[];

  @ManyToMany(type => Kelas)
  @JoinTable({
    name: 'pesertakelas',
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
