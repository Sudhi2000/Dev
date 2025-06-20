import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWaterDischargeStressComponent } from './add-water-discharge-stress.component';

describe('AddWaterDischargeStressComponent', () => {
  let component: AddWaterDischargeStressComponent;
  let fixture: ComponentFixture<AddWaterDischargeStressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWaterDischargeStressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWaterDischargeStressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
