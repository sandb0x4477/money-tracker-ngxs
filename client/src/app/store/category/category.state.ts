import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import _orderBy from 'lodash.orderby';

import { ApiService } from '../../_services/api.service';
import { CategoryModel } from '../../_common/app.models';
import {
  GET_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
  REORDER_CATEGORIES,
} from './category.actions';

const categoryStateDefaults: CategoryModel[] = null;

@Injectable()
@State<CategoryModel[]>({
  name: 'categories',
  defaults: categoryStateDefaults,
})
export class CategoryState implements NgxsOnInit {
  constructor(private apiService: ApiService) {}

  ngxsOnInit({ dispatch }: StateContext<CategoryModel[]>) {
    dispatch(new GET_CATEGORIES());
  }

  @Selector()
  public static categories(state: CategoryModel[]) {
    return _orderBy(state, ['sequence'], ['asc']);
  }

  @Selector()
  public static catsIncome(state: CategoryModel[]) {
    return _orderBy(state, ['sequence'], ['asc'])
      .filter(c => c.deleted === false && c.parentId === null && c.type === 0)
      .map(item => {
        return {
          ...item,
          subCount: state.filter(s => s.parentId === item.id && s.deleted === false).length,
        };
      });
  }

  @Selector()
  public static catsExpense(state: CategoryModel[]) {
    return _orderBy(state, ['sequence'], ['asc'])
      .filter(c => c.deleted === false && c.parentId === null && c.type === 1)
      .map(item => {
        return {
          ...item,
          subCount: state.filter(s => s.parentId === item.id && s.deleted === false).length,
        };
      });
  }

  @Selector()
  public static subCats(state: CategoryModel[]) {
    return _orderBy(state, ['sequence'], ['asc']).filter(c => c.deleted === false && c.parentId !== null);
  }

  @Action(GET_CATEGORIES, { cancelUncompleted: true })
  public getCategories({ setState }: StateContext<CategoryModel[]>) {
    return this.apiService.getCategories().pipe(tap(categories => setState(categories)));
  }

  @Action(ADD_CATEGORY, { cancelUncompleted: true })
  public addCategory({ setState, getState }: StateContext<CategoryModel[]>, { payload }: ADD_CATEGORY) {
    return this.apiService.addCategory(payload).pipe(tap(cat => setState([...getState(), cat])));
  }

  @Action(UPDATE_CATEGORY, { cancelUncompleted: true })
  public updateCategory({ setState, getState }: StateContext<CategoryModel[]>, { payload }: UPDATE_CATEGORY) {
    return this.apiService.updateCategory(payload).pipe(
      tap(cat =>
        setState([
          ...getState().map(item => {
            return item.id === cat.id ? cat : item;
          }),
        ]),
      ),
    );
  }

  @Action(REMOVE_CATEGORY, { cancelUncompleted: true })
  public removeCategory({ setState, getState }: StateContext<CategoryModel[]>, { payload }: REMOVE_CATEGORY) {
    return this.apiService.removeCategory(payload).pipe(
      tap(cat =>
        setState([
          ...getState().map(item => {
            return item.id === cat.id ? cat : item;
          }),
        ]),
      ),
    );
  }

  @Action(REORDER_CATEGORIES, { cancelUncompleted: true })
  public reorderCategories({ setState }: StateContext<CategoryModel[]>, { payload }: REORDER_CATEGORIES) {
    return this.apiService.reorderCategories(payload).pipe(tap(cats => setState(cats)));
  }
}
