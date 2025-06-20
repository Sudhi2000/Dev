import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeePerfomanceReviewComponent } from './add-employee-perfomance-review.component';

describe('AddEmployeePerfomanceReviewComponent', () => {
  let component: AddEmployeePerfomanceReviewComponent;
  let fixture: ComponentFixture<AddEmployeePerfomanceReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeePerfomanceReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeePerfomanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
