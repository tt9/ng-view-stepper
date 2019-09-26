import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStepperComponent } from './view-stepper.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { QueryList, Component, ViewChild } from '@angular/core';
import { ViewStepperViewComponent } from '../view-stepper-view/view-stepper-view.component';

@Component({
  template: `
    <ng-view-stepper>
      <ng-view-stepper-view key="page-1">
        <ng-template>
          <div id="test-view-1"></div>
        </ng-template>
      </ng-view-stepper-view>
      <ng-view-stepper-view key="page-2">
        <ng-template>
          <div id="test-view-2"></div>
        </ng-template>
      </ng-view-stepper-view>
    </ng-view-stepper>
  `,
})
class ViewStepperTestComponent {
  @ViewChild(ViewStepperComponent) viewStepper: ViewStepperComponent;
}

describe('ViewStepperComponent', () => {
  let component: ViewStepperComponent;
  let fixture: ComponentFixture<ViewStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [
        ViewStepperComponent,
        ViewStepperViewComponent,
        ViewStepperTestComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(ViewStepperComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  function createComponent() {
    fixture = TestBed.createComponent(ViewStepperComponent);
    component = fixture.componentInstance;
  }

  function createTestWrapperComponent() {
    const tFixture = TestBed.createComponent(ViewStepperTestComponent);
    const tComponent: ViewStepperTestComponent = tFixture.componentInstance;
    return <
      {
        fixture: ComponentFixture<ViewStepperTestComponent>;
        component: ViewStepperTestComponent;
      }
    >{
      fixture: tFixture,
      component: tComponent,
    };
  }

  function destroyComponent() {
    if (fixture) {
      fixture.destroy();
    }
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  describe('ngAfterContentInit', () => {
    it('should map the view contentChildren to an internal views array', () => {
      createComponent();
      const testRef1: any = { key: '1' };
      const testRef2: any = { key: '2' };
      component.views = new QueryList<any>();
      component.views.reset([testRef1, testRef2]);

      component.ngAfterContentInit();

      expect(component.viewArray.length).toBe(2);
      expect(component.viewArray[0].view).toBe(testRef1);
      expect(component.viewArray[1].view).toBe(testRef2);
      expect(component.viewArray[0].key).toBe('1');
      expect(component.viewArray[1].key).toBe('2');
      expect(component.viewArray[0].index).toBe(0);
      expect(component.viewArray[1].index).toBe(1);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should call the renderInitialView mmethod', () => {
      createComponent();

      const rivSpy = spyOn(component, 'renderInitialView').and.stub();
      component.ngAfterViewInit();
      expect(rivSpy.calls.count()).toBe(1);
    });
  });

  describe('renderInitialView', () => {
    it('should render div#test-view-1', async(async () => {
      const { fixture, component } = createTestWrapperComponent();
      fixture.detectChanges();
      await fixture.whenStable();
      const testViewEl = fixture.debugElement.nativeElement.querySelector(
        '#test-view-1'
      );
      expect(testViewEl).toBeTruthy();
    }));

    it('should not render div#test-view-2', async(async () => {
      const { fixture, component } = createTestWrapperComponent();
      fixture.detectChanges();
      await fixture.whenStable();
      const testViewEl = fixture.debugElement.nativeElement.querySelector(
        '#test-view-2'
      );
      expect(testViewEl).toBeFalsy();
    }));
  });

  describe('goToView', () => {
    it('should render div#test-view-2', async(async () => {
      const { fixture, component } = createTestWrapperComponent();
      fixture.detectChanges();
      await fixture.whenStable();
      await component.viewStepper.goToView('page-2');
      const testViewEl = fixture.debugElement.nativeElement.querySelector(
        '#test-view-2'
      );
      expect(testViewEl).toBeTruthy();
    }));
  });
});
