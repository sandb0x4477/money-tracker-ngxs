import { Index, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { NumericTransformer } from '../shared/numeric.transformer';
import { Category } from '../category/category.entity';

@Index('budget_pk', ['id'], { unique: true })
@Index('budget_id_uindex', ['id'], { unique: true })
@Entity('budget', { schema: 'public' })
export class BudgetEntity {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'id' })
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number | null;

  @Column('numeric', {
    name: 'amount',
    precision: 18,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  amount: number;

  @Column('character varying', { name: 'month', nullable: true, length: 12 })
  month: string | null;

  // @Column('character varying', { name: 'start', nullable: true, length: 12 })
  // start: string | null;

  @ManyToOne(
    () => Category,
    category => category.budget,
    {
      onDelete: 'SET NULL',
      eager: false
    },
  )
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;
}
