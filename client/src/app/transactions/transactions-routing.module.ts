import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionsPage } from './transactions.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionsPage,
    children: [
      {
        path: 'daily',
        loadChildren: () => import('./daily/daily.module').then(m => m.DailyPageModule),
      },
      // {
      //   path: 'calendar',
      //   loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarPageModule),
      // },
      {
        path: 'monthly',
        loadChildren: () => import('./monthly/monthly.module').then(m => m.MonthlyPageModule),
      },
      // {
      //   path: 'budget',
      //   loadChildren: () => import('./budget/budget.module').then( m => m.BudgetPageModule)
      // },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsPageRoutingModule {}
