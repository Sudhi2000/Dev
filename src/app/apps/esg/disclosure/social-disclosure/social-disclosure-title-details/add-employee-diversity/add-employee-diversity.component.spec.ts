import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeDiversityComponent } from './add-employee-diversity.component';

describe('AddEmployeeDiversityComponent', () => {
  let component: AddEmployeeDiversityComponent;
  let fixture: ComponentFixture<AddEmployeeDiversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeDiversityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeDiversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
