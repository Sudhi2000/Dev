import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientRecordComponent } from './view-patient-record.component';

describe('ViewPatientRecordComponent', () => {
  let component: ViewPatientRecordComponent;
  let fixture: ComponentFixture<ViewPatientRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPatientRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPatientRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
