export interface AccountModel {
  id?:       number;
  name:     string;
  deleted:  boolean;
  sequence: number;
}
export interface CategoryModel {
  id?: number;
  deleted: boolean;
  type: number;
  name: string;
  sequence: number;
  parentId: number | null;
  subCount?: number;
}

export function createAccount(params: Partial<AccountModel>) {
  return {
    ...params,
  } as AccountModel;
}

export function createCategory(params: Partial<CategoryModel>) {
  return {
    ...params,
  } as CategoryModel;
}
