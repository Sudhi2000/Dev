import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActionPlanComponent } from './view-action-plan.component';

describe('ViewActionPlanComponent', () => {
  let component: ViewActionPlanComponent;
  let fixture: ComponentFixture<ViewActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
