import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeRetirementBenefitsComponent } from './add-employee-retirement-benefits.component';

describe('AddEmployeeRetirementBenefitsComponent', () => {
  let component: AddEmployeeRetirementBenefitsComponent;
  let fixture: ComponentFixture<AddEmployeeRetirementBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeRetirementBenefitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeRetirementBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
