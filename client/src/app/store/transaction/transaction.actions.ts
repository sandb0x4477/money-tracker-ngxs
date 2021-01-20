import { TransactionModel, QueryModel } from '../../_common/app.models';

export class GET_TRANS {
  static readonly type = '[TRANS] GetTrans';
}

export class ADD_TRANS {
  static readonly type = '[TRANS] AddTrans';
  constructor(public readonly payload: Partial<TransactionModel>) {}
}

export class UPDATE_TRANS {
  static readonly type = '[TRANS] UpdateTrans';
  constructor(public readonly payload: Partial<TransactionModel>) {}
}

export class DELETE_TRANS {
  static readonly type = '[TRANS] DeleteTrans';
  constructor(public readonly payload: number) {}
}

export class SET_ACTIVE_TRANS {
  static readonly type = '[TRANS] SetActiveTrans';
  constructor(public readonly payload: TransactionModel) {}
}

export class GET_MONTHLY_TOTALS {
  static readonly type = '[TRANS] GetMonthlyTotals';
  // constructor(public readonly payload: QueryModel) {}
}

export class SET_DATE_TRANS {
  static readonly type = '[TRANS] SetDateTrans';
  constructor(public readonly payload: {date: Date, type: string}) {}
}
