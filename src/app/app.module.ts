import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineModule } from './components/line/line.module';
import { BarModule } from './components/bar/bar.module';
import { PieModule } from './components/pie/pie.module';
import { AreaModule } from './components/area/area.module';
import { BandModule } from './components/band/band.module';
import { MultilineModule } from './components/multiline/multiline.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LineModule,
    PieModule,
    BarModule,
    AreaModule,
    BandModule,
    MultilineModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule { }
