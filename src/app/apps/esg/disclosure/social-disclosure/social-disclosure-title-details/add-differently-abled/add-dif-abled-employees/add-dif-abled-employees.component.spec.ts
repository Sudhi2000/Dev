import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDifAbledEmployeesComponent } from './add-dif-abled-employees.component';

describe('AddDifAbledEmployeesComponent', () => {
  let component: AddDifAbledEmployeesComponent;
  let fixture: ComponentFixture<AddDifAbledEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDifAbledEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDifAbledEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
