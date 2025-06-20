import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyConsumptionComponent } from './modify-consumption.component';

describe('ModifyConsumptionComponent', () => {
  let component: ModifyConsumptionComponent;
  let fixture: ComponentFixture<ModifyConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyConsumptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
