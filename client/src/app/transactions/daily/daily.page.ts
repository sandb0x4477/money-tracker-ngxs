import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { parseISO } from 'date-fns';
import { map } from 'rxjs/operators';

import { TransactionModel, CategoryModel, DailyDataModel } from '../../_common/app.models';
import { UtilityService } from '../../_services/utility.service';
import { Observable, combineLatest } from 'rxjs';
import { CategoryState, TransState, SET_ACTIVE_TRANS } from '../../store';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.page.html',
  styleUrls: ['./daily.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyPage implements OnInit {
  @Select(TransState.transactions) transactions$: Observable<TransactionModel[]>;
  @Select(CategoryState.categories) categories$: Observable<CategoryModel[]>;

  @SelectSnapshot(TransState.dateTrans) date: Date | null;

  transDaily$: Observable<DailyDataModel>;

  constructor(private router: Router, private utilityService: UtilityService, private store: Store) {
    this.transDaily$ = combineLatest([this.transactions$, this.categories$]).pipe(
      map(([transaction, category]) => {
        return transaction.map(trans => {
          return {
            ...trans,
            fullDate: parseISO(trans.fullDate as string),
            catFullName: this.utilityService.catFullName(
              category.find(c => c.id === trans.categoryId),
              category.find(c => c.id === trans.subCategoryId) || null,
            ),
            category: category.find(c => c.id === trans.categoryId),
            subCategory: category.find(c => c.id === trans.subCategoryId) || null,
          };
        });
      }),
      map(items => this.utilityService.processDailyData(items, this.date)),
    );
  }

  ngOnInit() {}

  newTrans() {
    this.router.navigate(['new'], {
      queryParams: { returnUrl: this.router.routerState.snapshot.url },
    });
  }

  editTrans(item: TransactionModel) {
    this.store.dispatch(new SET_ACTIVE_TRANS(item));
    // this.actionsService.setActiveTrans(item);
    this.router.navigate(['edit'], {
      queryParams: { returnUrl: this.router.routerState.snapshot.url },
    });
  }
}
