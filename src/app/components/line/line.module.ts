import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineComponent } from './line.component';
import { LineService } from './services/line.service';

@NgModule({
  declarations: [LineComponent, ],
  imports: [
    CommonModule
  ],
  exports: [LineComponent],
  providers: [
    LineService
  ]
})
export class LineModule { }
