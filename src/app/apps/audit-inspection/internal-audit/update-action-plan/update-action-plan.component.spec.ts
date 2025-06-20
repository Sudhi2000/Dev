import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateActionPlanComponent } from './update-action-plan.component';

describe('UpdateActionPlanComponent', () => {
  let component: UpdateActionPlanComponent;
  let fixture: ComponentFixture<UpdateActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
