import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from '../summary/summary.component';
import { MyFinancesComponent } from './my-finances.component';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  declarations: [MyFinancesComponent, SummaryComponent],
  imports: [CommonModule, SharedModule],
  exports: [MyFinancesComponent, SummaryComponent],
})
export class MyFinancesModule {}
