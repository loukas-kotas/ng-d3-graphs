import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineModule } from 'ng-d3-graphs';
import { BarModule } from 'ng-d3-graphs';
import { PieModule } from 'ng-d3-graphs';
// import { AreaModule } from 'ng-d3-graphs'; TODO: comment in when issue #96 is done.
import { BandModule } from 'ng-d3-graphs';
import { MultilineModule } from 'ng-d3-graphs';

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
    // AreaModule, TODO: comment in when issue #96 is done.
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
