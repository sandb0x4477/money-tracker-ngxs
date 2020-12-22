import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DeleteResult } from 'typeorm';
import { format } from 'date-fns';

import { Transaction } from './transaction.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class TransactionService {
  constructor(
    private notificationService: NotificationService,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  /* ----------------------- GET ALL BY DATES ----------------------- */
  async getByDate(payload: { start: string; end: string }): Promise<Transaction[]> {
    const transactions = await this.transactionRepo.find({
      where: {
        shortDate: Between(payload.start, payload.end),
      },
      order: {
        fullDate: 'ASC',
      },
    });
    return transactions;
  }

  /* --------------------------- GET BY ID -------------------------- */
  async getById(id: number, relations = false): Promise<Transaction> {
    let result: Transaction;
    if (relations) {
      result = await this.transactionRepo.findOne({
        where: {id},
        relations: ['account', 'category', 'subCategory']
      })
    } else {
      result = await this.transactionRepo.findOne(id);
    }


    if (!result) {
      throw new NotFoundException(`Transaction with id: ${id} not found`);
    }

    return result;
  }

  /* ---------------------------- CREATE ---------------------------- */
  async create(user:any, payload: Partial<Transaction>): Promise<Transaction> {
    const result = this.transactionRepo.create(payload);

    await this.transactionRepo.save(result);
    const transactionToReturn = await this.getById(result.id, true);

    await this.notificationService.pushNotificationToSubscribers(user, transactionToReturn)

    return transactionToReturn;
  }

  /* ---------------------------- UPDATE ---------------------------- */
  async update(id: number, payload: Partial<Transaction>): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne(id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with id: ${id} not found`);
    }

    await this.transactionRepo.update({ id }, payload);
    const transactionToEmit = await this.getById(id);

    return transactionToEmit;
  }

  /* ---------------------------- DELETE ---------------------------- */
  async delete(id: number): Promise<DeleteResult> {
    const transaction = await this.transactionRepo.findOne(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with id: ${id} not found`);
    }
    const result = await this.transactionRepo.delete(transaction);
    return result;
  }

  /* -------------------- STATS PIE CHART -------------------- */
  async statsPieChart(payload: { start: string; end: string; incexp: string }): Promise<any> {
    console.log('TC: payload', payload);
    const querySql = `SELECT * FROM stats_piechart_fn($1, $2, $3);`;

    const result = await this.transactionRepo.query(querySql, [payload.start, payload.end, payload.incexp]);

    return result.map((obj: any) => {
      const rObj = {} as any;
      rObj.categoryId = obj.exp_category_id;
      rObj.name = obj.exp_category_name;
      rObj.total = parseFloat(obj.exp_total);
      rObj.percent = parseFloat(obj.exp_percent);
      return rObj;
    });
  }

  /* -------------------- STATS FOR MAIN CATEGORY ------------------- */
  async statsMainCategory(payload: { start: string; end: string; catid: string }): Promise<any> {
    const querySql = `SELECT * FROM stats_main_category_fn($1, $2, $3);`;

    const result = await this.transactionRepo.query(querySql, [payload.start, payload.end, payload.catid]);

    return result.map((obj: any) => {
      const rObj = {} as any;
      rObj.categoryId = obj.exp_sub_category_id;
      rObj.name = obj.exp_sub_category_name;
      rObj.total = parseFloat(obj.ex_total);
      rObj.percent = parseFloat(obj.exp_percent);
      return rObj;
    });
  }

  async getStatsCategoryLastTwelve(payload: {
    start: string;
    end: string;
    catid: string;
    maincat: string;
  }): Promise<any> {
    let querySql: string;
    if (payload.maincat === '1') {
      querySql = `SELECT * FROM stats_category_last_twelve_fn($1, $2, $3);`;
    } else if (payload.maincat === '0') {
      querySql = `SELECT * FROM stats_subcategory_last_twelve_fn($1, $2, $3);`;
    } else {
      querySql = `SELECT * FROM stats_other_category_last_twelve_fn($1, $2, $3);`;
    }

    const result = await this.transactionRepo.query(querySql, [payload.start, payload.end, payload.catid]);

    return result.map((obj: any) => {
      const rObj = {} as any;
      rObj.monthNum = obj.exp_month_num;
      rObj.month = obj.exp_month;
      rObj.year = obj.exp_year;
      rObj.total = parseFloat(obj.exp_total);
      return rObj;
    });
  }
  async getTransactionsByCategory(payload: {
    start: string;
    end: string;
    catid: string;
    maincat: string;
  }): Promise<Transaction[]> {
    let query = {};
    if (payload.maincat === '1') {
      query = {
        categoryId: payload.catid,
      };
    } else if (payload.maincat === '0') {
      query = {
        subCategoryId: payload.catid,
      };
    } else {
      query = {
        categoryId: payload.catid,
        subCategoryId: null,
      };
    }

    const transactions = await this.transactionRepo.find({
      where: {
        shortDate: Between(payload.start, payload.end),
        ...query,
      },
      order: {
        fullDate: 'DESC',
      },
    });
    return transactions;
  }

  /* ------------------------- MONTHLY STATS ------------------------ */
  async getMonthlyStats(payload: { start: string; end: string }): Promise<any> {
    const querySql = `SELECT * FROM summary_per_month_fn($1, $2);`;
    const result = await this.transactionRepo.query(querySql, [payload.start, payload.end]);

    return result.map((obj: any) => {
      const rObj = {} as any;
      rObj.month = obj.exp_month.trim();
      rObj.monthNum = parseInt(obj.exp_month_num);
      (rObj.year = parseInt(obj.exp_year)), (rObj.incomeTotal = parseFloat(obj.exp_income_total) || 0);
      rObj.expenseTotal = parseFloat(obj.exp_expense_total) || 0;
      return rObj;
    });
  }

  async getCalendarData(payload: { start: string; end: string }): Promise<any[]> {
    const { start, end } = payload;
    // const start1 = "2019-01-01";
    // const end1 = "2019-02-28";

    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select(['short_date', 'type'])
      .addSelect('SUM(transaction.amount)', 'sum')
      .where('short_date >= :start', { start })
      .andWhere('short_date <= :end', { end })
      .groupBy('short_date')
      .addGroupBy('type')
      .orderBy('short_date')
      .getRawMany();

    return result.map((obj: any) => {
      const rObj = {} as any;
      rObj.shortDate = format(obj.short_date, 'yyyy-MM-dd');
      rObj.type = obj.type;
      rObj.sum = parseFloat(obj.sum);
      return rObj;
    });
  }
}
