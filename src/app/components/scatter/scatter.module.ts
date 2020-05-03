import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ScatterComponent } from './scatter.component';

@NgModule({
  declarations: [ScatterComponent],
  imports: [CommonModule],
  exports: [ScatterComponent],
})
export class ScatterModule {}
