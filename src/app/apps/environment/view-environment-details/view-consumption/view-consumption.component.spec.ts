import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOnlyConsumptionComponent } from './view-consumption.component';

describe('ViewConsumptionComponent', () => {
  let component: ViewOnlyConsumptionComponent;
  let fixture: ComponentFixture<ViewOnlyConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOnlyConsumptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOnlyConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
