import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsumptionComponent } from './add-consumption.component';

describe('AddConsumptionComponent', () => {
  let component: AddConsumptionComponent;
  let fixture: ComponentFixture<AddConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConsumptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
