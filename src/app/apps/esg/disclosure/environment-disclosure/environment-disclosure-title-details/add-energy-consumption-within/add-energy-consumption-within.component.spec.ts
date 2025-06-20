import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEnergyConsumptionWithinComponent } from './add-energy-consumption-within.component';

describe('AddEnergyConsumptionWithinComponent', () => {
  let component: AddEnergyConsumptionWithinComponent;
  let fixture: ComponentFixture<AddEnergyConsumptionWithinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEnergyConsumptionWithinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEnergyConsumptionWithinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
