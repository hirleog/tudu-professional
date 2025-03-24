import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { NavModule } from '../nav/nav.module';
import { AppHomeComponent } from './app-home/app-home.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { FlowEndComponent } from './flow-end/flow-end.component';
import { ProfileComponent } from './profile/profile.component';
import { ProgressDetailComponent } from './progress-detail/progress-detail.component';
import { ProgressComponent } from './progress/progress.component';
import { CalendarComponent } from '../calendar/calendar.component';

const routes: Routes = [
  { path: 'home', component: AppHomeComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'progress', component: ProgressComponent },  
  { path: 'progress-detail', component: ProgressDetailComponent },
  { path: 'detail', component: CardDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'end', component: FlowEndComponent },
];

@NgModule({
  declarations: [
    AppHomeComponent,
    BudgetsComponent,
    CardDetailComponent,
    ProgressComponent,
    ProgressDetailComponent,
    ProfileComponent,
    FlowEndComponent,
    CalendarComponent
  ],
  imports: [SharedModule, NavModule, RouterModule.forChild(routes)],
})
export class MainAppModule {}
