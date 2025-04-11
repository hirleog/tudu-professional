import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusFilterPipe } from 'src/app/components/helpers/status-filter.pipe';
import { NavModule } from 'src/app/components/nav/nav.module';

@NgModule({
  declarations: [StatusFilterPipe],
  imports: [],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, NavModule, StatusFilterPipe],
  providers: [DatePipe]
})
export class SharedModule {}
