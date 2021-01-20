import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import {
  GET_TRANS,
  ADD_TRANS,
  GET_MONTHLY_TOTALS,
  SET_DATE_TRANS,
  SET_ACTIVE_TRANS,
  DELETE_TRANS,
  UPDATE_TRANS,
} from './transaction.actions';
import { TransactionModel, Period, MonthlyStatsModel } from '../../_common/app.models';
import { ApiService } from '../../_services/api.service';
import { UtilityService } from '../../_services/utility.service';

interface TransStateModel {
  dateTrans: Date;
  dateMonthly: Date;
  dateBudget: Date;
  transactions: TransactionModel[];
  monthlyStats: MonthlyStatsModel[];
  activeTrans: TransactionModel;
}

const transStateDefaults: TransStateModel = {
  dateTrans: new Date('2020-06-22T10:16:59.235Z'),
  dateMonthly: new Date('2020-06-22T10:16:59.235Z'),
  dateBudget: new Date(),
  transactions: [],
  monthlyStats: [],
  activeTrans: null,
};

@Injectable()
@State<TransStateModel>({
  name: 'trans',
  defaults: transStateDefaults,
})
export class TransState implements NgxsOnInit {
  constructor(private apiService: ApiService, private utilityService: UtilityService) {}

  ngxsOnInit({ dispatch }: StateContext<TransStateModel>) {
    dispatch([new GET_TRANS(), new GET_MONTHLY_TOTALS()]);
  }

  @Selector()
  static transactions(state: TransStateModel) {
    return state.transactions;
  }

  @Selector()
  static monthlyStats(state: TransStateModel) {
    return state.monthlyStats;
  }

  @Selector()
  static activeTrans(state: TransStateModel) {
    return state.activeTrans;
  }

  @Selector()
  static dateTrans(state: TransStateModel) {
    return state.dateTrans;
  }

  @Selector()
  static allDates(state: TransStateModel) {
    const { dateTrans, dateMonthly, dateBudget } = state;
    return { dateTrans, dateMonthly, dateBudget };
  }

  //! ---------------------------- ACTIONS --------------------------- */
  @Action(GET_TRANS, { cancelUncompleted: true })
  getTrans({ getState, patchState }: StateContext<TransStateModel>) {
    const query = this.utilityService.getQueryFortyTwoDays(getState().dateTrans);
    return this.apiService.getTransactions(query).pipe(tap(transactions => patchState({ transactions })));
  }

  @Action(GET_MONTHLY_TOTALS, { cancelUncompleted: true })
  getMonthlyTotals({ getState, patchState }: StateContext<TransStateModel>) {
    const query = this.utilityService.getQuery(getState().dateMonthly, Period.YEARLY);
    return this.apiService
      .getMonthlyStats(query)
      .pipe(tap(monthlyTotals => patchState({ monthlyStats: monthlyTotals })));
  }

  @Action(ADD_TRANS, { cancelUncompleted: true })
  addTrans({ dispatch }: StateContext<TransStateModel>, { payload }: ADD_TRANS) {
    return this.apiService
      .addTransaction(payload)
      .pipe(tap(_ => dispatch([new GET_TRANS(), new GET_MONTHLY_TOTALS()])));
  }

  @Action(UPDATE_TRANS, { cancelUncompleted: true })
  updateTrans({ dispatch }: StateContext<TransStateModel>, { payload }: UPDATE_TRANS) {
    return this.apiService
      .updateTransaction(payload)
      .pipe(tap(_ => dispatch([new GET_TRANS(), new GET_MONTHLY_TOTALS()])));
  }

  @Action(DELETE_TRANS, { cancelUncompleted: true })
  deleteTrans({ dispatch }: StateContext<TransStateModel>, { payload }: DELETE_TRANS) {
    return this.apiService
      .deleteTransaction(payload)
      .pipe(tap(_ => dispatch([new GET_TRANS(), new GET_MONTHLY_TOTALS()])));
  }

  @Action(SET_ACTIVE_TRANS, { cancelUncompleted: true })
  setActiveTrans({ patchState }: StateContext<TransStateModel>, { payload }: SET_ACTIVE_TRANS) {
    patchState({
      activeTrans: payload,
    });
  }

  // ! ----------------------------- DATES ---------------------------- */
  @Action(SET_DATE_TRANS)
  setDateTrans({ dispatch, patchState }: StateContext<TransStateModel>, { payload }: SET_DATE_TRANS) {
    const { date, type } = payload;
    patchState({
      [type]: date,
    });
    switch (type) {
      case 'dateMonthly':
        dispatch([new GET_MONTHLY_TOTALS()]);
        break;

      case 'dateBudget':
        // this.getAllBudgets();
        break;

      default:
        dispatch([new GET_TRANS()]);
        break;
    }
  }
}
