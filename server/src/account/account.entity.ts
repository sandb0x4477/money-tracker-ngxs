import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Transaction } from '../transaction/transaction.entity';
import { RepeatTrans } from '../repeat-trans/repeat-trans.entity';
// import { Transactions } from "./Transactions";

@Index('account_id_uindex', ['id'], { unique: true })
@Index('account_pk', ['id'], { unique: true })
@Entity('account', { schema: 'public' })
export class Account {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', length: 50, unique: true })
  name: string;

  @Column('boolean', {
    name: 'deleted',
    default: () => 'false',
  })
  deleted: boolean;

  @Column({ type: 'smallint', name: 'sequence', generated: true })
  sequence: number;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @OneToMany(() => RepeatTrans, (repeat) => repeat.account, { lazy: true })
  repeats: Promise<RepeatTrans[]>;
}
