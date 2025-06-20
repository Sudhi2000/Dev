import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEnergyConsumptionOutsideComponent } from './add-energy-consumption-outside.component';

describe('AddEnergyConsumptionOutsideComponent', () => {
  let component: AddEnergyConsumptionOutsideComponent;
  let fixture: ComponentFixture<AddEnergyConsumptionOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEnergyConsumptionOutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEnergyConsumptionOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
