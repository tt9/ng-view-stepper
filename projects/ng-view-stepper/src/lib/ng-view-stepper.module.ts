import { NgModule } from "@angular/core";
import { ViewStepperComponent } from "./view-stepper/view-stepper.component";
import { ViewStepperViewComponent } from "./view-stepper-view/view-stepper-view.component";

@NgModule({
  declarations: [ViewStepperComponent, ViewStepperViewComponent],
  imports: [],
  exports: [ViewStepperComponent, ViewStepperViewComponent]
})
export class NgViewStepperModule {}
