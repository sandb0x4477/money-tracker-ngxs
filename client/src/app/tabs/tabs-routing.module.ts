import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      // {
      //   path: 'trans',
      //   loadChildren: () => import('../transactions/transactions.module').then(m => m.TransactionsPageModule),
      // },
      // {
      //   path: 'stats',
      //   loadChildren: () => import('../stats/stats.module').then(m => m.StatsPageModule),
      // },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule),
      },
      // {
      //   path: 'test',
      //   loadChildren: () => import('../test/test.module').then(m => m.TestPageModule),
      // },

      {
        path: '',
        redirectTo: 'settings',
        pathMatch: 'full',
      },
    ],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
