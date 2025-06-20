import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMedicinePrescriptionComponent } from './view-medicine-prescription.component';

describe('ViewMedicinePrescriptionComponent', () => {
  let component: ViewMedicinePrescriptionComponent;
  let fixture: ComponentFixture<ViewMedicinePrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMedicinePrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMedicinePrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
