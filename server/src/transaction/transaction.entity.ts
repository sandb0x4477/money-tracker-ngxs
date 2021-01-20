import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { NumericTransformer } from '../shared/numeric.transformer';
import { Category } from '../category/category.entity';

@Index('transaction_id_uindex', ['id'], { unique: true })
@Index('transaction_pk', ['id'], { unique: true })
@Entity('transaction', { schema: 'public' })
export class Transaction {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('smallint', { name: 'type', default: () => 1 })
  type: number;

  @Column('timestamp without time zone', { name: 'full_date'})
  fullDate: Date;

  @Column('date', { name: 'short_date'})
  shortDate: string;

  @Column('numeric', {
    name: 'amount',
    precision: 18,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  amount: number;

  @Column('character varying', { name: 'memo', nullable: true, length: 80 })
  memo: string | null;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'sub_category_id', nullable: true })
  subCategoryId: number | null;

  @ManyToOne(
    () => Category,
    category => category.transactionsMain,
    {
      onDelete: 'SET NULL',
      eager: false
    },
  )
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;

  @ManyToOne(
    () => Category,
    category => category.transactionsSub,
    {
      onDelete: 'SET NULL',
      eager: false
    },
  )
  @JoinColumn([{ name: 'sub_category_id', referencedColumnName: 'id' }])
  subCategory: Category;
}
