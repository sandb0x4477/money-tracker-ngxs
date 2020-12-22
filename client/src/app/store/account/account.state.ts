import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import _orderBy from 'lodash.orderby';

import {
  GET_ACCOUNTS,
  ADD_ACCOUNT,
  UPDATE_ACCOUNT,
  REMOVE_ACCOUNT,
  REORDER_ACCOUNTS,
} from './account.actions';
import { ApiService } from '../../_services/api.service';
import { AccountModel } from '../../_common/app.models';

const accountStateDefaults: AccountModel[] = null;

@Injectable({
  providedIn: 'root',
})
@State<AccountModel[]>({
  name: 'accounts',
  defaults: accountStateDefaults,
})
export class AccountState implements NgxsOnInit {
  constructor(private apiService: ApiService) {}

  ngxsOnInit({ dispatch }: StateContext<AccountModel[]>) {
    dispatch(new GET_ACCOUNTS());
  }

  @Selector()
  public static accounts(state: AccountModel[]) {
    return _orderBy(state, ['sequence'], ['asc']).filter(a => a.deleted === false);
  }

  @Action(GET_ACCOUNTS, { cancelUncompleted: true })
  public getAccounts({ setState }: StateContext<AccountModel[]>) {
    return this.apiService.getAccounts().pipe(tap(accounts => setState(accounts)));
  }

  @Action(ADD_ACCOUNT, { cancelUncompleted: true })
  public addAccounts({ setState, getState }: StateContext<AccountModel[]>, { payload }: ADD_ACCOUNT) {
    return this.apiService.addAccount(payload).pipe(
      tap(account => setState([...getState(), account])),
    );
  }

  @Action(UPDATE_ACCOUNT, { cancelUncompleted: true })
  public updateAccount({ setState, getState }: StateContext<AccountModel[]>, { payload }: UPDATE_ACCOUNT) {
    return this.apiService.updateAccount(payload).pipe(
      tap(account =>
        setState([
          ...getState().map(item => {
            return item.id === account.id ? account : item;
          }),
        ]),
      ),
    );
  }

  @Action(REMOVE_ACCOUNT, { cancelUncompleted: true })
  public removeAccount({ setState, getState }: StateContext<AccountModel[]>, { payload }: REMOVE_ACCOUNT) {
    return this.apiService.removeAccount(payload).pipe(
      tap(account =>
        setState([
          ...getState().map(item => {
            return item.id === account.id ? account : item;
          }),
        ]),
      ),
    );
  }

  @Action(REORDER_ACCOUNTS, { cancelUncompleted: true })
  public reorderAccounts({ setState, getState }: StateContext<AccountModel[]>, { payload }: REORDER_ACCOUNTS) {
    return this.apiService.reorderAccounts(payload).pipe(
      tap(accounts => setState(accounts)),
    );
  }
}
