import { NgModule, ModuleWithProviders } from '@angular/core';
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
export class LineModule {
  public static forRoot(config): ModuleWithProviders {
    return {
      ngModule: LineModule,
      providers: [
        LineService,
        { provide: 'config', useValue: config },
      ]
    };
  }
 }


