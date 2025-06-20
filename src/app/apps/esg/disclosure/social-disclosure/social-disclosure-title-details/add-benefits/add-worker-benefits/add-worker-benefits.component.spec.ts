import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkerBenefitsComponent } from './add-worker-benefits.component';

describe('AddWorkerBenefitsComponent', () => {
  let component: AddWorkerBenefitsComponent;
  let fixture: ComponentFixture<AddWorkerBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkerBenefitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkerBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
