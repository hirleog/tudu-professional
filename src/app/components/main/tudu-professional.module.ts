import { NgModule } from '@angular/core';

import { TitleCasePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxCurrencyModule } from 'ngx-currency';
import { CustomModalModule } from 'src/shared/components/custom-modal/custom-modal.module';
import { SharedModule } from 'src/shared/shared.module';
import { TuduUiCalendarModule } from 'tudu-ui-calendar/src/lib/tudu-ui-calendar.module';
import { CardSkeletonModule } from '../template/card-skeleton/card-skeleton.module';
import { AppHomeComponent } from './app-home/app-home.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { FlowEndComponent } from './flow-end/flow-end.component';
import { HistoricComponent } from './historic/historic.component';
import { MyFinancesComponent } from './my-finances/my-finances/my-finances.component';
import { MyFinancesModule } from './my-finances/my-finances/my-finances.module';
import { ProgressDetailComponent } from './progress-detail/progress-detail.component';
import { ProgressComponent } from './progress/progress.component';

const routes: Routes = [
  { path: 'home', component: AppHomeComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'progress-detail', component: ProgressDetailComponent },
  { path: 'historic', component: HistoricComponent },
  { path: 'end', component: FlowEndComponent },
  { path: 'finances', component: MyFinancesComponent },
];

@NgModule({
  declarations: [
    AppHomeComponent,
    BudgetsComponent,
    ProgressComponent,
    ProgressDetailComponent,
    FlowEndComponent,
    HistoricComponent,
  ],
  imports: [
    SharedModule,
    TuduUiCalendarModule,
    CardSkeletonModule,
    MyFinancesModule,
    CustomModalModule,
    NgxCurrencyModule,

    RouterModule.forChild(routes),
  ],
  providers: [TitleCasePipe],
})
export class TuduProfessionalModule {}
