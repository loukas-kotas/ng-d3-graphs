import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaComponent } from './area.component';



@NgModule({
  declarations: [AreaComponent],
  imports: [
    CommonModule
  ],
  exports: [AreaComponent],
})
export class AreaModule { }
