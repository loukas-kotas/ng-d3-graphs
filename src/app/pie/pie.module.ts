import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieComponent } from './pie.component';



@NgModule({
  declarations: [PieComponent],
  imports: [
    CommonModule
  ],
  exports: [PieComponent]
})
export class PieModule { }
