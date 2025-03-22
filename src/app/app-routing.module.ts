import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetsComponent } from './components/main/budgets/budgets.component';

const routes: Routes = [
  {
    path: 'tudu-professional',
    loadChildren: () =>
      import('./components/main/main-app.module').then((m) => m.MainAppModule),
  },
  {
    path: 'budgets',
    component: BudgetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
