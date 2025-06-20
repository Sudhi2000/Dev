import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkerRetirementBenefitsComponent } from './add-worker-retirement-benefits.component';

describe('AddWorkerRetirementBenefitsComponent', () => {
  let component: AddWorkerRetirementBenefitsComponent;
  let fixture: ComponentFixture<AddWorkerRetirementBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkerRetirementBenefitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkerRetirementBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
