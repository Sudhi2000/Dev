import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueMedicinePrescriptionComponent } from './issue-medicine-prescription.component';

describe('IssueMedicinePrescriptionComponent', () => {
  let component: IssueMedicinePrescriptionComponent;
  let fixture: ComponentFixture<IssueMedicinePrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueMedicinePrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueMedicinePrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
