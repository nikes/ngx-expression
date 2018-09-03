import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxExpressionsModule} from '../../projects/ngx-expressions/src/lib/ngx-expressions.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxExpressionsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
