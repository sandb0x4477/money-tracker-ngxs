export interface CategoryModel {
  id?: number;
  deleted: boolean;
  type: number;
  name: string;
  sequence: number;
  parentId: number | null;
  subCount?: number;
}

export interface TransactionModel {
  id?: number;
  type: number;
  fullDate: string | Date;
  shortDate: string;
  amount: number;
  memo: string | null;
  categoryId: number;
  subCategoryId: number | null;
  catFullName?: string | null;
  category?: CategoryModel;
  subCategory?: CategoryModel;
}

export interface MonthlyStatsModel {
  month: string;
  monthNum: number;
  year: number;
  incomeTotal: number;
  expenseTotal: number;
}

export interface DailyDataModel {
  dailyData: DailyData[];
  totalIncome: number;
  totalExpense: number;
}

export interface DailyData {
  header: Header;
  result: TransactionModel[];
}

export interface Header {
  income: number;
  expense: number;
  dayOfTheMonth: string;
  monthYear: string;
  weekDay: string;
}

export interface QueryModel {
  start: string;
  end: string;
}


export enum Period {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export function createCategory(params: Partial<CategoryModel>) {
  return {
    ...params,
  } as CategoryModel;
}

export function createTransaction() {
  return {
    type: 1,
    fullDate: new Date(),
    shortDate: null,
    amount: 0,
    memo: null,
    categoryId: null,
    subCategoryId: null,
    catFullName: null,
    category: null,
    subCategory: null,
  } as TransactionModel;
}
