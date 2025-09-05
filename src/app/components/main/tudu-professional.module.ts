import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { TuduUiCalendarModule } from 'tudu-ui-calendar/src/lib/tudu-ui-calendar.module';
import { CalendarComponent } from '../calendar/calendar.component';
import { NavModule } from '../nav/nav.module';
import { CardSkeletonModule } from '../template/card-skeleton/card-skeleton.module';
import { AppHomeComponent } from './app-home/app-home.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { FlowEndComponent } from './flow-end/flow-end.component';
import { MyFinancesComponent } from './my-finances/my-finances/my-finances.component';
import { MyFinancesModule } from './my-finances/my-finances/my-finances.module';
import { ProgressDetailComponent } from './progress-detail/progress-detail.component';
import { ProgressComponent } from './progress/progress.component';
import { CustomModalModule } from 'src/shared/components/custom-modal/custom-modal.module';
import { NgxCurrencyModule } from 'ngx-currency';

const routes: Routes = [
  { path: 'home', component: AppHomeComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'progress-detail', component: ProgressDetailComponent },
  { path: 'detail', component: CardDetailComponent },
  { path: 'end', component: FlowEndComponent },
  { path: 'finances', component: MyFinancesComponent },
];

@NgModule({
  declarations: [
    AppHomeComponent,
    BudgetsComponent,
    CardDetailComponent,
    ProgressComponent,
    ProgressDetailComponent,
    FlowEndComponent,
    CalendarComponent,
  ],
  imports: [
    SharedModule,
    NavModule,
    TuduUiCalendarModule,
    CardSkeletonModule,
    MyFinancesModule,
    CustomModalModule,
    NgxCurrencyModule,
    RouterModule.forChild(routes),
  ],
})
export class TuduProfessionalModule {}
