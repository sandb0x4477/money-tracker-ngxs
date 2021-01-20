import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CategoryModel, TransactionModel, QueryModel, MonthlyStatsModel } from '../_common/app.models';

const BASE_URL = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /* ---------------------------------------------------------------- */
  //!                             CATEGORIES                          */
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

  /* ---------------------------------------------------------------- */
  // !                           TRANSACTIONS                         */
  /* ---------------------------------------------------------------- */
  /* ------------------------------ GET ----------------------------- */
  getTransactions(query: QueryModel): Observable<TransactionModel[]> {
    const params = new HttpParams().set('start', query.start).set('end', query.end);
    return this.http.get<TransactionModel[]>(BASE_URL + '/transaction', { params });
  }

  /* ------------------------------ ADD ----------------------------- */
  addTransaction(payload: Partial<TransactionModel>) {
    return this.http.post<TransactionModel>(BASE_URL + `/transaction`, payload);
  }

  /* ---------------------------- UPDATE ---------------------------- */
  updateTransaction(payload: Partial<TransactionModel>): Observable<TransactionModel> {
    return this.http.put<TransactionModel>(BASE_URL + `/transaction/${payload.id}/edit`, payload);
  }

  /* ---------------------------- DELETE ---------------------------- */
  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(BASE_URL + `/transaction/${id}`);
  }

  /* ------------------------- MONTHLY STATS ------------------------- */
  getMonthlyStats(query: QueryModel): Observable<MonthlyStatsModel[]> {
    const httpParams = new HttpParams().set('start', query.start).set('end', query.end);
    return this.http.get<MonthlyStatsModel[]>(BASE_URL + '/transaction/stats/monthly', {
      params: httpParams,
    });
  }
}
