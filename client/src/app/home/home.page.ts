import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AccountState, CategoryState } from '../store';
import { AccountModel, CategoryModel } from '../_common/app.models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @Select(AccountState.accounts) accounts$: Observable<AccountModel[]>;
  @Select(CategoryState.categories) categories$: Observable<CategoryModel[]>;

  constructor() {}

}
