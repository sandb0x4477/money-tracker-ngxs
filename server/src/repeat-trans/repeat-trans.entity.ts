import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { NumericTransformer } from '../shared/numeric.transformer';
import { Account } from '../account/account.entity';
import { Category } from '../category/category.entity';

@Index('repeat_pk', ['id'], { unique: true })
@Entity('repeat', { schema: 'public' })
export class RepeatTrans {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'id' })
  id: number;

  @Column('smallint', { name: 'type', default: () => '1' })
  type: number;

  @Column('smallint', { name: 'repeat' })
  repeat: number;

  @Column('numeric', {
    name: 'amount',
    nullable: true,
    precision: 18,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  amount: number | null;

  @Column('character varying', {
    name: 'memo',
    nullable: true,
    length: 50,
    default: () => 'NULL::character varying',
  })
  memo: string | null;

  @Column('date', { name: 'created' })
  created: string;

  @Column('date', { name: 'next_date' })
  nextDate: string;

  @Column({ name: 'account_id' })
  accountId: number;

  @ManyToOne(
    () => Account,
    account => account.repeats,
    {
      onDelete: 'SET NULL',
      eager: false,
    },
  )
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: Account;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(
    () => Category,
    category => category.repeatsMain,
    {
      onDelete: 'SET NULL',
      eager: false
    },
  )
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;

  @Column({ name: 'sub_category_id', nullable: true })
  subCategoryId: number | null;

  @ManyToOne(
    () => Category,
    category => category.repeatsSub,
    {
      onDelete: 'SET NULL',
      eager: false
    },
  )
  @JoinColumn([{ name: 'sub_category_id', referencedColumnName: 'id' }])
  subCategory: Category;
}
