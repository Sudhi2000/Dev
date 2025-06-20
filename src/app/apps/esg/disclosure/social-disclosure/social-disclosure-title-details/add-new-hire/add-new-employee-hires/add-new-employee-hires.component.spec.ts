import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEmployeeHiresComponent } from './add-new-employee-hires.component';

describe('AddNewEmployeeHiresComponent', () => {
  let component: AddNewEmployeeHiresComponent;
  let fixture: ComponentFixture<AddNewEmployeeHiresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewEmployeeHiresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewEmployeeHiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
