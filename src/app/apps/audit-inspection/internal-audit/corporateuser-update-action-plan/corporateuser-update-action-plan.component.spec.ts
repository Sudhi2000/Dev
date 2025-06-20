import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateuserUpdateActionPlanComponent } from './corporateuser-update-action-plan.component';

describe('CorporateuserUpdateActionPlanComponent', () => {
  let component: CorporateuserUpdateActionPlanComponent;
  let fixture: ComponentFixture<CorporateuserUpdateActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateuserUpdateActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateuserUpdateActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
