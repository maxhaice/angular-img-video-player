  import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
  import {TimerHelper} from "./helpers/timer.helper";
  import {MediaHelper} from "./helpers/media.helper";
  import {MediaService} from "./services/media.service";
  import {AnimationHelper} from "./helpers/animation.helper";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    HttpClient,
    TimerHelper,
    MediaHelper,
    MediaService,
    AnimationHelper,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
