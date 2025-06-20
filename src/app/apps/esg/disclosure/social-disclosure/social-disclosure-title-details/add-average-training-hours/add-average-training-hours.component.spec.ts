import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAverageTrainingHoursComponent } from './add-average-training-hours.component';

describe('AddAverageTrainingHoursComponent', () => {
  let component: AddAverageTrainingHoursComponent;
  let fixture: ComponentFixture<AddAverageTrainingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAverageTrainingHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAverageTrainingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
