import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavModule } from 'src/app/components/nav/nav.module';



@NgModule({
  declarations: [
  ],
  imports: [
    // CommonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // NavModule,

  ]
})
export class SharedModule { }
