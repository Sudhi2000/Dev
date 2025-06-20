import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRecordModifyComponent } from './patient-record-modify.component';

describe('PatientRecordModifyComponent', () => {
  let component: PatientRecordModifyComponent;
  let fixture: ComponentFixture<PatientRecordModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientRecordModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRecordModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
