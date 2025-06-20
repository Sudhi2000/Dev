import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicalPrescriptionComponent } from './create-medical-prescription.component';

describe('CreateUpdateMedicalPrescriptionComponent', () => {
  let component: CreateMedicalPrescriptionComponent;
  let fixture: ComponentFixture<CreateMedicalPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMedicalPrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMedicalPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
