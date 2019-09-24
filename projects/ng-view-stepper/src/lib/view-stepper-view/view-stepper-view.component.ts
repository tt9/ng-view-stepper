import {
  Component,
  OnInit,
  TemplateRef,
  ContentChild,
  Input
} from "@angular/core";

@Component({
  selector: "ng-view-stepper-view",
  templateUrl: "./view-stepper-view.component.html",
  styleUrls: ["./view-stepper-view.component.scss"]
})
export class ViewStepperViewComponent implements OnInit {
  @ContentChild(TemplateRef) template: TemplateRef<any>;

  @Input() key: string;

  constructor() {}

  ngOnInit() {
    if (!this.key) {
      throw new Error("ViewStepperView must define an input for key");
    }
  }
}
