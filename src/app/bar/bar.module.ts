import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarComponent } from './bar.component';
import { BarService } from './bar.service';



@NgModule({
  declarations: [BarComponent],
  imports: [
    CommonModule
  ],
  providers: [
    BarService
  ],
  exports: [BarComponent]
})
export class BarModule { }
