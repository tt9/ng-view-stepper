import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { NgViewStepperModule } from "projects/ng-view-stepper/src/public-api";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, NgViewStepperModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
