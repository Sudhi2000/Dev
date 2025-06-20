import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMedicalPrescriptionComponent } from './view-medical-prescription.component';

describe('ViewMedicalPrescriptionComponent', () => {
  let component: ViewMedicalPrescriptionComponent;
  let fixture: ComponentFixture<ViewMedicalPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMedicalPrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMedicalPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
