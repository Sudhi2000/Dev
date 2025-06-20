import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMeterComponent } from './add-new-meter.component';

describe('AddNewMeterComponent', () => {
  let component: AddNewMeterComponent;
  let fixture: ComponentFixture<AddNewMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewMeterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
