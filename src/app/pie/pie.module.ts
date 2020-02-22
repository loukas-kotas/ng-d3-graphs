import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieComponent } from './pie.component';
import { PieService } from './pie.service';



@NgModule({
  declarations: [PieComponent],
  imports: [
    CommonModule
  ],
  providers: [
    PieService,
  ],
  exports: [PieComponent]
})
export class PieModule { }
