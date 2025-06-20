import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeTrainingOnHsMeasuresComponent } from './add-employee-training-on-hs-measures.component';

describe('AddEmployeeTrainingOnHsMeasuresComponent', () => {
  let component: AddEmployeeTrainingOnHsMeasuresComponent;
  let fixture: ComponentFixture<AddEmployeeTrainingOnHsMeasuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeTrainingOnHsMeasuresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeTrainingOnHsMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
