import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AccountModel, CategoryModel } from '../_common/app.models';

const BASE_URL = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /* ---------------------------------------------------------------- */
  //!                             ACCOUNTS                            */
  /* ---------------------------------------------------------------- */
  /* ------------------------------ GET ----------------------------- */
  getAccounts(): Observable<AccountModel[]> {
    return this.http.get<AccountModel[]>(BASE_URL + '/account');
  }

  /* ------------------------------ ADD ----------------------------- */
  addAccount(payload: Partial<AccountModel>): Observable<AccountModel> {
    return this.http.post<AccountModel>(BASE_URL + '/account', payload);
  }

  /* ------------------------------ UPDATE ----------------------------- */
  updateAccount(payload: Partial<AccountModel>): Observable<AccountModel> {
    return this.http.put<AccountModel>(BASE_URL + `/account/${payload.id}/edit`, payload);
  }

  /* ------------------------------ REMOVE ----------------------------- */
  removeAccount(id: number): Observable<AccountModel> {
    return this.http.put<AccountModel>(BASE_URL + `/account/${id}/delete`, {});
  }

  /* ------------------------------ REORDER ----------------------------- */
  reorderAccounts(payload: { moveFrom: number; moveTo: number }): Observable<Partial<AccountModel[]>> {
    return this.http.post<Partial<AccountModel[]>>(BASE_URL + '/account/reorder', payload);
  }

  /* ---------------------------------------------------------------- */
  //!                             CATEGORIES                                */
  /* ---------------------------------------------------------------- */
  /* ------------------------------ GET ----------------------------- */
  getCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(BASE_URL + '/category');
  }

  /* ------------------------------ ADD ----------------------------- */
  addCategory(payload: Partial<CategoryModel>): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(BASE_URL + '/category', payload);
  }

  /* ------------------------------ UPDATE -------------------------- */
  updateCategory(payload: Partial<CategoryModel>) {
    return this.http.put<CategoryModel>(BASE_URL + `/category/${payload.id}/edit`, payload);
  }

  /* ------------------------------ REMOVE ----------------------------- */
  removeCategory(id: number): Observable<CategoryModel> {
    return this.http.put<CategoryModel>(BASE_URL + `/category/${id}/delete`, {});
  }

  /* ------------------------------ REORDER ----------------------------- */
  reorderCategories(payload: { moveFrom: number; moveTo: number }): Observable<CategoryModel[]> {
    return this.http.post<CategoryModel[]>(BASE_URL + '/category/reorder', payload);
  }
}
