import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineModule } from 'ng-d3';
import { BarModule } from 'ng-d3';
import { PieModule } from 'ng-d3';
import { AreaModule } from 'ng-d3';
import { BandModule } from 'ng-d3';
import { MultilineModule } from 'ng-d3';

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
