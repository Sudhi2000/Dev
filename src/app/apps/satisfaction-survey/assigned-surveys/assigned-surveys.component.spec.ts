import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedSurveysComponent } from './assigned-surveys.component';

describe('AssignedSurveysComponent', () => {
  let component: AssignedSurveysComponent;
  let fixture: ComponentFixture<AssignedSurveysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedSurveysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedSurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
