export abstract class ViewStepperAnimation {
  abstract execute(
    currentViewNode: HTMLElement,
    currentViewBoundingRect: ClientRect,
    currentViewIndex: number,
    targetViewNode: HTMLElement,
    targetParentBoundingRect: ClientRect,
    targetViewIndex: number,
    viewParentNode: HTMLElement,
    viewParentBoundingRect: ClientRect
  ): Promise<() => void>;
}
