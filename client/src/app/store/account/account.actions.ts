import { AccountModel } from '../../_common/app.models';

export class GET_ACCOUNTS {
  static readonly type = '[ACCOUNT] GetAccounts';
}

export class ADD_ACCOUNT {
  static readonly type = '[ACCOUNT] AddAccount';
  constructor(public readonly payload: Partial<AccountModel>) {}
}

export class UPDATE_ACCOUNT {
  static readonly type = '[ACCOUNT] UpdateAccount';
  constructor(public readonly payload: Partial<AccountModel>) {}
}

export class REMOVE_ACCOUNT {
  static readonly type = '[ACCOUNT] RemoveAccount';
  constructor(public readonly payload: number) {}
}

export class REORDER_ACCOUNTS {
  static readonly type = '[ACCOUNT] ReorderAccounts';
  constructor(public readonly payload: { moveFrom: number; moveTo: number }) {}
}
