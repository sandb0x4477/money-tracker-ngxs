import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Transaction } from '../transaction/transaction.entity';
import { RepeatTrans } from '../repeat-trans/repeat-trans.entity';
import { BudgetEntity } from '../budget/budget.entity';

@Index('category_pk', ['id'], { unique: true })
@Index('category_id_uindex', ['id'], { unique: true })
@Entity('category', { schema: 'public' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'id' })
  id: number;

  @Column('boolean', {
    name: 'deleted',
    default: () => 'false',
  })
  deleted: boolean;

  @Column('smallint', { name: 'type', default: () => 1 })
  type: number;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @Column({ type: 'smallint', name: 'sequence', generated: true })
  sequence: number;

  @Column('smallint', { name: 'parent_id' })
  parentId: number;

  @OneToMany(
    () => Transaction,
    transactions => transactions.category,
  )
  transactionsMain: Transaction[];

  @OneToMany(
    () => Transaction,
    transactions => transactions.subCategory,
  )
  transactionsSub: Transaction[];

  @OneToMany(() => RepeatTrans, (repeat) => repeat.category, { lazy: true })
  repeatsMain: RepeatTrans[];

  @OneToMany(() => RepeatTrans, (repeat) => repeat.subCategory, { lazy: true })
  repeatsSub: RepeatTrans[];

  @OneToMany(() => BudgetEntity, (budget) => budget.category, { lazy: true })
  budget: BudgetEntity[];
}
