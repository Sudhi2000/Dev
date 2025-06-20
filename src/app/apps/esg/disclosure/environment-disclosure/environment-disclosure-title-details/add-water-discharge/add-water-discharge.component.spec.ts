import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWaterDischargeComponent } from './add-water-discharge.component';

describe('AddWaterDischargeComponent', () => {
  let component: AddWaterDischargeComponent;
  let fixture: ComponentFixture<AddWaterDischargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWaterDischargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWaterDischargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
