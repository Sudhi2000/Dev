import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineApprovalComponent } from './medicine-approval.component';

describe('MedicineApprovalComponent', () => {
  let component: MedicineApprovalComponent;
  let fixture: ComponentFixture<MedicineApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
