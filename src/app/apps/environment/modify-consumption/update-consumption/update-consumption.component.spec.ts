import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConsumptionComponent } from './update-consumption.component';

describe('UpdateConsumptionComponent', () => {
  let component: UpdateConsumptionComponent;
  let fixture: ComponentFixture<UpdateConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateConsumptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
