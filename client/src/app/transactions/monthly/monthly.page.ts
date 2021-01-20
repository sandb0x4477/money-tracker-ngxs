import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TransState, CategoryState } from '../../store';
import { TransactionModel, CategoryModel, MonthlyStatsModel } from '../../_common/app.models';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.page.html',
  styleUrls: ['./monthly.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyPage implements OnInit {
  @Select(TransState.transactions) transactions$: Observable<TransactionModel[]>;
  @Select(CategoryState.categories) categories$: Observable<CategoryModel[]>;
  @Select(TransState.monthlyStats) monthlyStats$: Observable<MonthlyStatsModel[]>;

  monthlyStatsTotals$: Observable<{
    yearlyIncome: number;
    yearlyExpense: number;
  }>;

  constructor(private router: Router, public store: Store) {
    this.monthlyStatsTotals$ = this.monthlyStats$.pipe(
      map(data => {
        return {
          yearlyIncome: data.reduce((acc, curVal) => acc + curVal.incomeTotal, 0),
          yearlyExpense: data.reduce((acc, curVal) => acc + curVal.expenseTotal, 0),
        };
      }),
    );
  }

  ngOnInit() {}

  newTrans() {
    this.router.navigate(['new'], {
      queryParams: { returnUrl: this.router.routerState.snapshot.url },
    });
  }
}
