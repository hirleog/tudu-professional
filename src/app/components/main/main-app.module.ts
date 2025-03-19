import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AppHomeComponent } from './app-home/app-home.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { ProgressComponent } from './progress/progress.component';
import { ProgressDetailComponent } from './progress-detail/progress-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { FlowEndComponent } from './flow-end/flow-end.component';
import { SharedModule } from 'src/shared/shared.module';
import { NavComponent } from '../nav/nav.component';
import { NavModule } from '../nav/nav.module';

const routes: Routes = [
  // { path: '', component: AppMenuComponent },
  // { path: '', component: AppHomeComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'progress-detail', component: ProgressDetailComponent },
  { path: 'detail', component: CardDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'end', component: FlowEndComponent },
];

@NgModule({
  declarations: [
    // AppHomeComponent,
    BudgetsComponent,
    CardDetailComponent,
    ProgressComponent,
    ProgressDetailComponent,
    ProfileComponent,
    FlowEndComponent,
    // NavComponent
  ],
  imports: [SharedModule, NavModule, RouterModule.forChild(routes)],
})
export class MainAppModule {}
