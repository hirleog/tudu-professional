import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuduComponentsModule } from 'tudu-components';

@NgModule({
  declarations: [],
  imports: [TuduComponentsModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuduComponentsModule,
  ],
  providers: [DatePipe],
})
export class SharedModule {}
