import { CategoryModel } from '../../_common/app.models';

export class GET_CATEGORIES {
  static readonly type = '[CATEGORY] GetCategories';
}

export class ADD_CATEGORY {
  static readonly type = '[CATEGORY] AddCategory';
  constructor(public readonly payload: Partial<CategoryModel>) {}
}

export class UPDATE_CATEGORY {
  static readonly type = '[CATEGORY] UpdateCategory';
  constructor(public readonly payload: Partial<CategoryModel>) {}
}

export class REMOVE_CATEGORY {
  static readonly type = '[CATEGORY] RemoveCategory';
  constructor(public readonly payload: number) {}
}

export class REORDER_CATEGORIES {
  static readonly type = '[CATEGORY] ReorderCategories';
  constructor(public readonly payload: { moveFrom: number; moveTo: number }) {}
}
