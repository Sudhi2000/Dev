import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWaterWithdrawalComponent } from './add-water-withdrawal.component';

describe('AddWaterWithdrawalComponent', () => {
  let component: AddWaterWithdrawalComponent;
  let fixture: ComponentFixture<AddWaterWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWaterWithdrawalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWaterWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
