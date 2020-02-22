import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineModule } from './line/line.module';
import { PieComponent } from './pie/pie.component';
import { BarModule } from './bar/bar.module';

@NgModule({
  declarations: [
    AppComponent,
    PieComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LineModule,
    BarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule { }
