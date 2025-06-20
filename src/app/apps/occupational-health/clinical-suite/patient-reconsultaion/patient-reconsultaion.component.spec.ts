import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientReconsultaionComponent } from './patient-reconsultaion.component';

describe('PatientReconsultaionComponent', () => {
  let component: PatientReconsultaionComponent;
  let fixture: ComponentFixture<PatientReconsultaionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientReconsultaionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientReconsultaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
