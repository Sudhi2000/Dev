import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSurveyComponent } from './action-survey.component';

describe('ActionSurveyComponent', () => {
  let component: ActionSurveyComponent;
  let fixture: ComponentFixture<ActionSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
