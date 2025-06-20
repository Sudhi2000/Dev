import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionCategoryComponent } from './survey-question-category.component';

describe('SurveyQuestionCategoryComponent', () => {
  let component: SurveyQuestionCategoryComponent;
  let fixture: ComponentFixture<SurveyQuestionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyQuestionCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyQuestionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
