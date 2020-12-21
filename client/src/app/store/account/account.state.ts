import { State } from '@ngxs/store';

interface AccountStateModel {
  accounts: any[];
}

const accountStateDefaults: AccountStateModel = {
  accounts: null,
};

@State<AccountStateModel>({
  name: 'accounts',
  defaults: accountStateDefaults,
})
export class AccountState {
  constructor() {}
}
