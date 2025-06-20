import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineTransactionComponent } from './medicine-transaction.component';

describe('MedicineTransactionComponent', () => {
  let component: MedicineTransactionComponent;
  let fixture: ComponentFixture<MedicineTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
