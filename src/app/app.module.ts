import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineModule } from './line/line.module';
import { PieComponent } from './pie/pie.component';

@NgModule({
  declarations: [
    AppComponent,
    PieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LineModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule { }
