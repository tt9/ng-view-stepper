import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Input,
  AfterViewInit,
  EmbeddedViewRef,
  ElementRef,
  Renderer2,
  Optional,
  Injector,
} from '@angular/core';
import { ViewStepperViewComponent } from '../view-stepper-view/view-stepper-view.component';
import { ViewStepperAnimation } from '../animations/view-stepper-animations';
import { FlyOutInAnimation } from '../animations/fly-out-in.animation';

@Component({
  selector: 'ng-view-stepper',
  templateUrl: './view-stepper.component.html',
  styleUrls: ['./view-stepper.component.scss'],
  exportAs: 'ngViewStepper',
})
export class ViewStepperComponent implements AfterContentInit, AfterViewInit {
  @ViewChild('viewOutlet', { read: ViewContainerRef })
  viewOutlet: ViewContainerRef;

  @ViewChild('viewParent')
  viewParent: ElementRef;

  get viewParentEl(): HTMLElement {
    return this.viewParent.nativeElement;
  }

  @ContentChildren(ViewStepperViewComponent) views: QueryList<
    ViewStepperViewComponent
  >;

  @Input() initialViewKey: string;

  @Input() animationRunner: ViewStepperAnimation;

  // TODO: prebuild a bunch of animations
  // and add an animationName input

  public viewArray: {
    view: ViewStepperViewComponent;
    index: number;
    key: string;
  }[];

  public currentView: {
    view: ViewStepperViewComponent;
    index: number;
    key: string;
    viewRef: EmbeddedViewRef<any>;
  };

  constructor(public renderer: Renderer2, private injector: Injector) {
    if (!this.animationRunner) {
      this.animationRunner = this.injector.get(FlyOutInAnimation);
    }
  }

  ngAfterContentInit() {
    this.viewArray = this.views.map((view, index) => {
      return {
        view: view,
        index: index,
        key: view.key,
      };
    });
  }

  ngAfterViewInit() {
    this.renderInitialView();
  }

  renderInitialView() {
    let initialView = this.viewArray[0];
    if (this.initialViewKey) {
      initialView = this.viewArray.find(v => v.key === this.initialViewKey);
    }
    if (!initialView) {
      throw new Error('Error getting initial view');
    }
    if (!initialView.view || !initialView.view.template) {
      throw new Error('Error getting initial view template');
    }
    const vr = this.viewOutlet.createEmbeddedView(initialView.view.template);

    this.currentView = {
      view: initialView.view,
      index: initialView.index,
      key: initialView.key,
      viewRef: vr,
    };
  }

  async goToView(viewKey) {
    if (this.currentView.key === viewKey) {
      return null;
    }

    const targetView = this.viewArray.find(v => v.key === viewKey);

    if (!targetView) {
      throw new Error('tried to navigate to a view that does not exist');
    }

    const viewParentBoundingRect = this.viewParentEl.getBoundingClientRect();
    const currentViewEl: HTMLElement = this.currentView.viewRef.rootNodes[0];
    const currentViewRect = currentViewEl.getBoundingClientRect();

    this.setElementAbsolutelyPositionedToFillParent(currentViewEl);

    this.renderer.setStyle(
      this.viewParentEl,
      'height',
      `${viewParentBoundingRect.height}px`
    );

    const targetEmbeddedViewRef = this.viewOutlet.createEmbeddedView(
      targetView.view.template
    );

    if (targetEmbeddedViewRef.rootNodes.length !== 1) {
      throw new Error('View stepper views must have one parent level element');
    }

    const targetViewBoundingRect = targetEmbeddedViewRef.rootNodes[0].getBoundingClientRect();

    const afterCleanup = await this.animationRunner.execute(
      currentViewEl,
      currentViewRect,
      this.currentView.index,
      targetEmbeddedViewRef.rootNodes[0],
      targetViewBoundingRect,
      targetView.index,
      this.viewParentEl,
      viewParentBoundingRect
    );

    // After the animations

    this.renderer.setStyle(this.viewParentEl, 'height', null);
    this.currentView.viewRef.destroy();
    this.currentView = {
      ...targetView,
      viewRef: targetEmbeddedViewRef,
    };
    if (afterCleanup) {
      afterCleanup();
    }
  }

  private setElementAbsolutelyPositionedToFillParent(el) {
    this.renderer.setStyle(el, 'position', 'absolute');
    this.renderer.setStyle(el, 'top', '0px');
    this.renderer.setStyle(el, 'bottom', '0px');
    this.renderer.setStyle(el, 'left', '0px');
    this.renderer.setStyle(el, 'right', '0px');
  }
}
