import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientReconsultationComponent } from './view-patient-reconsultation.component';

describe('ViewPatientReconsultationComponent', () => {
  let component: ViewPatientReconsultationComponent;
  let fixture: ComponentFixture<ViewPatientReconsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPatientReconsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPatientReconsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
