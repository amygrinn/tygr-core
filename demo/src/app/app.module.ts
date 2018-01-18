import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { TygrModule } from '@tygr/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TygrModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
