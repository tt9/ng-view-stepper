import { Injectable, Renderer2 } from '@angular/core';
import { ViewStepperAnimation } from './view-stepper-animations';
import {
  AnimationBuilder,
  animate,
  style,
  AnimationFactory,
} from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class FlyOutInAnimation implements ViewStepperAnimation {
  enteringAnimation: AnimationFactory;
  parentAnimation: AnimationFactory;
  constructor(public animBuilder: AnimationBuilder) {}
  async execute(
    currentViewNode: HTMLElement,
    currentViewBoundingRect: ClientRect,
    currentViewIndex: number,
    targetViewNode: HTMLElement,
    targetParentBoundingRect: ClientRect,
    targetViewIndex: number,
    viewParentNode: HTMLElement,
    viewParentBoundingRect: ClientRect
  ): Promise<any> {
    return new Promise(res => {
      const delayMs = 150;

      viewParentNode.style.overflow = 'hidden';
      const forward = targetViewIndex > currentViewIndex;
      targetViewNode.style.transform = forward
        ? 'translateX(32px)'
        : 'translateX(-32px)';
      targetViewNode.style.opacity = '0';
      setTimeout(() => {
        const apExit = this.getExitingAnimation(forward).create(
          currentViewNode
        );

        const apViewParent = this.getViewParentAnimation(
          targetParentBoundingRect.height
        ).create(viewParentNode);

        const apEnter = this.getEnteringAnimation().create(targetViewNode);

        let animationsFinished = 0;
        function onAnimDone() {
          animationsFinished++;
          if (animationsFinished === 3) {
            res(() => {
              targetViewNode.style.transform = null;
              targetViewNode.style.opacity = '1';
              apExit.destroy();
              apEnter.destroy();
              apViewParent.destroy();
            });
          }
        }

        apExit.onDone(onAnimDone);
        apEnter.onDone(onAnimDone);
        apViewParent.onDone(onAnimDone);

        apExit.play();
        apEnter.play();
        apViewParent.play();
      }, delayMs);
    });
  }

  getExitingAnimation(forward: boolean) {
    return this.animBuilder.build([
      animate(
        '200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        style({
          transform: forward
            ? 'translateX(-32px) scale(.95) '
            : 'translateX(32px) scale(.95) ',
          opacity: 0,
        })
      ),
    ]);
  }

  getViewParentAnimation(targetHeight) {
    return this.animBuilder.build([
      animate(
        '200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        style({
          height: `${targetHeight}px`,
        })
      ),
    ]);
  }

  getEnteringAnimation() {
    return this.animBuilder.build([
      animate(
        '200ms 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        style({
          transform: 'translateX(0px)',
          opacity: '1',
        })
      ),
    ]);
  }
}
