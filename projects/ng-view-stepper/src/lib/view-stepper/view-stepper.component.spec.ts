import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStepperComponent } from './view-stepper.component';

describe('ViewStepperComponent', () => {
  let component: ViewStepperComponent;
  let fixture: ComponentFixture<ViewStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
