import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseISO } from 'date-fns';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';

import { TransState, CategoryState, ADD_TRANS } from '../store';
import { TransactionModel, CategoryModel } from '../_common/app.models';
import { UtilityService } from '../_services/utility.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  @Select(TransState.transactions) transactions$: Observable<TransactionModel[]>;
  @Select(CategoryState.categories) categories$: Observable<CategoryModel[]>;

  @SelectSnapshot(TransState.dateTrans) date: Date | null;

  transDaily$: Observable<any>;

  constructor(private utilityService: UtilityService, private store: Store) {
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

  addTrans() {
    const payload: Partial<TransactionModel> = {
      fullDate: new Date('2020-06-02'),
      shortDate: '2020-06-02',
      type: 0,
      amount: 11,
      categoryId: 6,
      subCategoryId: 92,
      memo: 'dummy',
    };
    this.store.dispatch(new ADD_TRANS(payload));
  }
}
