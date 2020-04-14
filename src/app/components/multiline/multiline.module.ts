import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultilineComponent } from './multiline.component';



@NgModule({
  declarations: [MultilineComponent],
  imports: [
    CommonModule,
  ],
  exports: [MultilineComponent],
})
export class MultilineModule { }
