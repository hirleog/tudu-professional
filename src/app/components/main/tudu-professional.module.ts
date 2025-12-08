import { NgModule } from '@angular/core';

import { TitleCasePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxCurrencyModule } from 'ngx-currency';
import { environment } from 'src/environments/environment';
import { CustomModalModule } from 'src/shared/components/custom-modal/custom-modal.module';
import { SharedModule } from 'src/shared/shared.module';
import { TuduUiCalendarModule } from 'tudu-ui-calendar/src/lib/tudu-ui-calendar.module';
import { AgendaCalendarHeaderComponent } from '../agenda/agenda-calendar-header/agenda-calendar-header.component';
import { AgendaServiceListComponent } from '../agenda/agenda-service-list/agenda-service-list.component';
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
    AgendaCalendarHeaderComponent,
    AgendaServiceListComponent,
  ],
  imports: [
    SharedModule,
    TuduUiCalendarModule,
    CardSkeletonModule,
    MyFinancesModule,
    CustomModalModule,
    NgxCurrencyModule,

    RouterModule.forChild(routes),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [TitleCasePipe],
})
export class TuduProfessionalModule {}
