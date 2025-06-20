import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMedicineDisposalComponent } from './view-medicine-disposal.component';

describe('ViewMedicineDisposalComponent', () => {
  let component: ViewMedicineDisposalComponent;
  let fixture: ComponentFixture<ViewMedicineDisposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMedicineDisposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMedicineDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
