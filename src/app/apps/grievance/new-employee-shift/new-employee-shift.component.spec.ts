import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmployeeShiftComponent } from './new-employee-shift.component';

describe('NewEmployeeShiftComponent', () => {
  let component: NewEmployeeShiftComponent;
  let fixture: ComponentFixture<NewEmployeeShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEmployeeShiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEmployeeShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
