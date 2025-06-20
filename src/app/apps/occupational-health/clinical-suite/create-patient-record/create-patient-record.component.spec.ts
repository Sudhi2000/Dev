import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePatientRecordComponent } from './create-patient-record.component';

describe('CreatePatientRecordComponent', () => {
  let component: CreatePatientRecordComponent;
  let fixture: ComponentFixture<CreatePatientRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePatientRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePatientRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
