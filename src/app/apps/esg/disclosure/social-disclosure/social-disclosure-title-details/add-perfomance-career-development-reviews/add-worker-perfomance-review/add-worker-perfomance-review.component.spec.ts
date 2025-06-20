import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkerPerfomanceReviewComponent } from './add-worker-perfomance-review.component';

describe('AddWorkerPerfomanceReviewComponent', () => {
  let component: AddWorkerPerfomanceReviewComponent;
  let fixture: ComponentFixture<AddWorkerPerfomanceReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkerPerfomanceReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkerPerfomanceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
