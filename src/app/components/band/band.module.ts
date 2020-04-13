import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandComponent } from './band.component';



@NgModule({
  declarations: [BandComponent],
  imports: [
    CommonModule
  ],
  exports: [BandComponent],
})
export class BandModule { }
