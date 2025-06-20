import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifySurveyRespondentComponent } from './verify-survey-respondent.component';

describe('VerifySurveyRespondentComponent', () => {
  let component: VerifySurveyRespondentComponent;
  let fixture: ComponentFixture<VerifySurveyRespondentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifySurveyRespondentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifySurveyRespondentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
