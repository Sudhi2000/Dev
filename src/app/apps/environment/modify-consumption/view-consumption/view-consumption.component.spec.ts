import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsumptionComponent } from './view-consumption.component';

describe('ViewConsumptionComponent', () => {
  let component: ViewConsumptionComponent;
  let fixture: ComponentFixture<ViewConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewConsumptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
