import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWaterWithdrawalStressComponent } from './add-water-withdrawal-stress.component';

describe('AddWaterWithdrawalStressComponent', () => {
  let component: AddWaterWithdrawalStressComponent;
  let fixture: ComponentFixture<AddWaterWithdrawalStressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWaterWithdrawalStressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWaterWithdrawalStressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
