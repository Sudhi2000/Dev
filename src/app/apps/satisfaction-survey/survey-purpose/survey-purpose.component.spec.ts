import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyPurposeComponent } from './survey-purpose.component';

describe('SurveyPurposeComponent', () => {
  let component: SurveyPurposeComponent;
  let fixture: ComponentFixture<SurveyPurposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyPurposeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
