import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { MessageComponent } from './message/message.component';
import { OutputComponent } from './output/output.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    MessageComponent,
    OutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
