import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetEntity } from './budget.entity';
import { Repository, DeleteResult } from 'typeorm';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetEntity)
    private budgetRepo: Repository<BudgetEntity>,
  ) {}

  async getBudgetForMonth(payload: { month: string }): Promise<any[]> {
    const querySql = `SELECT * from budget_spending_per_month($1)`;

    const result = await this.budgetRepo.query(querySql, [payload.month]);

    return result.map((obj: any) => {
      const rObj = {} as any;
      rObj.categoryId = obj.exp_category_id;
      rObj.month = obj.exp_month;
      rObj.amount = parseFloat(obj.exp_amount);
      rObj.name = obj.exp_name;
      rObj.expense = parseFloat(obj.exp_expense);
      rObj.fraction = parseFloat(obj.exp_fraction);
      return rObj;
    });
  }

  async getBudgetByCategory(id: number, payload: { start: string; end: string }) {
    const querySql = `SELECT *
    FROM budget_by_category($1, $2, $3);`;

    const result = await this.budgetRepo.query(querySql, [payload.start, payload.end, id]);

    return result.map((obj: any) => {
      const rObj = {} as any;
      rObj.categoryId = obj.exp_category_id;
      rObj.month = obj.exp_month;
      rObj.amount = parseFloat(obj.exp_amount) || 0;
      return rObj;
    });
  }

  async create(payload: Partial<BudgetEntity>) {
    const budgets = await this.budgetRepo.find({
      where: {
        categoryId: payload.categoryId,
        month: payload.month,
      },
    });

    if (budgets.length) {
      await this.budgetRepo.update({ id: budgets[0].id }, payload);
    } else {
      const result = this.budgetRepo.create(payload);
      await this.budgetRepo.save(result);
    }

    return HttpStatus.CREATED;
  }

  async delete(id: number): Promise<any> {
    const querySql = `DELETE FROM budget WHERE category_id = $1;`;

    await this.budgetRepo.query(querySql, [id]);

    return HttpStatus.NO_CONTENT;
  }
}
