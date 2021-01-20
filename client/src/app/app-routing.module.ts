import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'app',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'edit',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./editnew/edit-trans/edit-trans.module').then(m => m.EditTransPageModule),
  },
  {
    path: 'new',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./editnew/new-trans/new-trans.module').then(m => m.NewTransPageModule),
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then(m => m.TestPageModule),
  },
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'app',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
