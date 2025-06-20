import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsideMedicineComponent } from './outside-medicine.component';

describe('OutsideMedicineComponent', () => {
  let component: OutsideMedicineComponent;
  let fixture: ComponentFixture<OutsideMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutsideMedicineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsideMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
