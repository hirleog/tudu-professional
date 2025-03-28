import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavModule } from 'src/app/components/nav/nav.module';

@NgModule({
  declarations: [],
  imports: [],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, NavModule],
  providers: [DatePipe]
})
export class SharedModule {}
